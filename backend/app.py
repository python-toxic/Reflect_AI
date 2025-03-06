from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
import google.generativeai as genai
import os
from bson import json_util, ObjectId
import json
import jwt
import bcrypt
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("API_KEY")

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['ai_counselor']
users_collection = db['users']
chats_collection = db['chats']
journal_collection = db['journal']

API_KEY = os.getenv("API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET")
genai.configure(api_key=API_KEY)

app = Flask(__name__)
CORS(app)

def parse_json(data):
    return json.loads(json_util.dumps(data))

# Authentication middleware
def get_user_id():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload['user_id']
    except:
        return None
    
@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not all([name, email, password]):
            return jsonify({"error": "All fields are required"}), 400

        # Check if user already exists
        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already registered"}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_id = ObjectId()
        user = {
            "_id": user_id,
            "name": name,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.now()
        }
        users_collection.insert_one(user)

        # Generate token
        token = jwt.encode(
            {"user_id": str(user_id), "email": email},
            JWT_SECRET,
            algorithm="HS256"
        )

        return jsonify({
            "token": token,
            "userId": str(user_id),
            "name": name
        })

    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Convert stored password from binary to string if needed
        stored_password = user['password']
        if isinstance(stored_password, bytes):
            stored_password = stored_password

        # Compare passwords
        if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return jsonify({"error": "Invalid email or password"}), 401

        token = jwt.encode(
            {"user_id": str(user['_id']), "email": email},
            JWT_SECRET,
            algorithm="HS256"
        )

        return jsonify({
            "token": token,
            "userId": str(user['_id']),
            "name": user['name']
        })

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/journal", methods=["POST"])
def save_journal():
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json
        entry = {
            "user_id": user_id,
            "content": data.get("entry"),
            "mood": data.get("mood"),
            "sleep_hours": data.get("sleepHours"),
            "tags": data.get("tags", []),
            "created_at": datetime.now()
        }
        
        result = journal_collection.insert_one(entry)
        return jsonify({"success": True, "entry_id": str(result.inserted_id)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/journal", methods=["GET"])
def get_journal_entries():
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        entries = journal_collection.find(
            {"user_id": user_id},
            sort=[("created_at", -1)]
        )
        
        # Format the entries to ensure dates are properly serialized
        formatted_entries = []
        for entry in entries:
            formatted_entry = {
                "_id": str(entry["_id"]),
                "user_id": entry["user_id"],
                "content": entry["content"],
                "mood": entry["mood"],
                "sleep_hours": entry["sleep_hours"],
                "tags": entry["tags"],
                # Convert the datetime to ISO format string
                "created_at": entry["created_at"].isoformat() if "created_at" in entry else None
            }
            formatted_entries.append(formatted_entry)
        
        return jsonify({"entries": formatted_entries})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])


def chat():
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json
        user_message = data.get("message", "")
        chat_id = data.get("chatId")

        if not chat_id:
            # Create a new chat with a unique ID
            chat_id = str(ObjectId())
            chat = {
                "_id": ObjectId(chat_id),
                "user_id": user_id,
                "messages": [],
                "created_at": datetime.now()
            }
        else:
            # Find existing chat and verify it belongs to this user
            chat = chats_collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
            if not chat:
                # If chat doesn't exist or doesn't belong to user, create a new one
                chat_id = str(ObjectId())
                chat = {
                    "_id": ObjectId(chat_id),
                    "user_id": user_id,
                    "messages": [],
                    "created_at": datetime.now()
                }

        new_user_message = {
            "role": "user",
            "content": user_message,
            "timestamp": datetime.now()
        }
        
        if "messages" not in chat:
            chat["messages"] = []
        chat["messages"].append(new_user_message)

        try:
            # Initialize the fine-tuned model using its ID
            model = genai.GenerativeModel(model_name="tunedModels/aihealthcare---b6hsd46xl3wv")
            
            # Create context from previous messages
            context = "You are a supportive AI counselor trained to assess mental health precisely. Previous conversation:\n"
            for msg in chat["messages"][-5:]:  # Only use last 5 messages for context
                speaker = "User" if msg["role"] == "user" else "Assistant"
                context += f"{speaker}: {msg['content']}\n"
            
            context += f"\nUser: {user_message}\nAssistant:"
            
            # Generate response using the fine-tuned model
            response = model.generate_content(context)
            response_text = response.text
            
            # Add AI response to messages
            ai_message = {
                "role": "assistant",
                "content": response_text,
                "timestamp": datetime.now()
            }
            chat["messages"].append(ai_message)

            # Save to database
            chats_collection.update_one(
                {"_id": chat["_id"]},
                {"$set": {
                    "user_id": user_id,
                    "messages": chat["messages"],
                    "updated_at": datetime.now()
                }},
                upsert=True
            )

            return jsonify({
                "response": response_text,
                "chatId": str(chat["_id"]),
                "messages": parse_json(chat["messages"])
            })

        except Exception as e:
            print(f"Model error: {str(e)}")
            return jsonify({
                "error": "AI model error",
                "details": str(e)
            }), 500

    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({"error": str(e)}), 500
@app.route("/get-chat-history", methods=["GET"])

def get_chat_history():
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        chat_id = request.args.get('chatId')
        if not chat_id:
            return jsonify({"error": "Chat ID required"}), 400

        # Find chat and verify it belongs to the current user
        chat = chats_collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
        if not chat:
            return jsonify({"messages": []})

        return jsonify({
            "messages": parse_json(chat.get("messages", []))
        })

    except Exception as e:
        print(f"Get chat history error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
# Add these new routes to your existing app.py

@app.route("/get-user-chats", methods=["GET"])
def get_user_chats():
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Get all chats for this user
        user_chats = chats_collection.find(
            {"user_id": user_id},
            sort=[("updated_at", -1)]
        )
        
        formatted_chats = []
        for chat in user_chats:
            # Generate a title from the first user message or use default
            title = "New conversation"
            for msg in chat.get("messages", []):
                if msg["role"] == "user":
                    # Use first 30 chars of first user message as title
                    title = msg["content"][:30] + ("..." if len(msg["content"]) > 30 else "")
                    break
            
            formatted_chats.append({
                "id": str(chat["_id"]),
                "title": title,
                "createdAt": chat.get("created_at").isoformat() if "created_at" in chat else ""
            })
        
        return jsonify({"chats": formatted_chats})
    
    except Exception as e:
        print(f"Get user chats error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/delete-chat/<chat_id>", methods=["DELETE"])
def delete_chat(chat_id):
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Delete chat (only if it belongs to the current user)
        result = chats_collection.delete_one({
            "_id": ObjectId(chat_id),
            "user_id": user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({"error": "Chat not found or not owned by user"}), 404
        
        return jsonify({"success": True})
    
    except Exception as e:
        print(f"Delete chat error: {str(e)}")
        return jsonify({"error": str(e)}), 500
@app.route("/dashboard-metrics", methods=["GET"])
def get_dashboard_metrics():
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Get recent journal entries (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        entries = journal_collection.find(
            {
                "user_id": user_id,
                "created_at": {"$gte": thirty_days_ago}
            }
        )
        entries_list = list(entries)
        
        # Get recent chats (last 30 days)
        chats = chats_collection.find(
            {
                "user_id": user_id,
                "updated_at": {"$gte": thirty_days_ago}
            }
        )
        chats_list = list(chats)
        
        if not entries_list and not chats_list:
            return jsonify({
                "depression": 00,
                "anxiety": 00,
                "stress": 00,
                "sleep": 0,
                "mood": 0,
                "recentActivities": []
            })
        
        try:
            # Initialize the fine-tuned model
            model = genai.GenerativeModel(model_name="tunedModels/aiforprediction-j0guzu9uletb")
            
            # Prepare input context for the model
            context = (
                "You are an AI trained to generate dashboard metrics (depression, anxiety, stress, sleep, mood) "
                "based on journal entries and AI chat conversations. Provide the output as a JSON object with keys: "
                "depression, anxiety, stress, sleep, mood (all values between 0-100). If JSON is not possible, output five numbers "
                "(one per line) in this order: depression, anxiety, stress, sleep, mood.\n"
                "Recent journal entries (last 30 days):\n"
            )
            for entry in entries_list:
                context += (
                    f"Date: {entry['created_at'].isoformat()}, Mood: {entry.get('mood', 'unknown')}, "
                    f"Sleep Hours: {entry.get('sleep_hours', 'N/A')}, Content: {entry.get('content', 'N/A')}, "
                    f"Tags: {', '.join(entry.get('tags', []))}\n"
                )
            context += "\nRecent AI chat conversations (last 30 days):\n"
            for chat in chats_list:
                messages = chat.get("messages", [])
                for msg in messages[-3:]:  # Limit to last 3 messages per chat for brevity
                    context += (
                        f"Date: {msg['timestamp'].isoformat()}, Role: {msg['role']}, "
                        f"Content: {msg['content']}\n"
                    )
            context += "\nGenerate the metrics now:"

            # Generate response from the fine-tuned model
            response = model.generate_content(context)
            response_text = response.text.strip()

            # Try parsing as JSON first
            try:
                metrics = json.loads(response_text)
                if not all(key in metrics for key in ["depression", "anxiety", "stress", "sleep", "mood"]):
                    raise ValueError("Missing required metric keys in model output")
            except json.JSONDecodeError:
                # Fallback: Parse plain text output
                print(f"Model output is not JSON, attempting plain text parsing: {response_text}")
                lines = response_text.splitlines()
                if len(lines) != 5 or not all(line.strip().isdigit() for line in lines):
                    return jsonify({"error": "Invalid model output format"}), 500
                
                metrics = {
                    "depression": int(lines[0]),
                    "anxiety": int(lines[1]),
                    "stress": int(lines[2]),
                    "sleep": int(lines[3]),
                    "mood": int(lines[4])
                }

            # Validate metric values
            for key, value in metrics.items():
                if not isinstance(value, (int, float)) or value < 0 or value > 100:
                    print(f"Invalid value for {key}: {value}")
                    return jsonify({"error": f"Invalid value for {key}"}), 500

            # Recent activities (from journal entries only)
            recent_activities = []
            for entry in sorted(entries_list, key=lambda x: x["created_at"], reverse=True)[:3]:
                recent_activities.append({
                    "type": "Journal",
                    "date": (datetime.now() - entry["created_at"]).days,
                    "description": f"Mood: {entry.get('mood', 'unknown')}"
                })

            return jsonify({
                "depression": round(metrics["depression"]),
                "anxiety": round(metrics["anxiety"]),
                "stress": round(metrics["stress"]),
                "sleep": round(metrics["sleep"]),
                "mood": round(metrics["mood"]),
                "recentActivities": recent_activities
            })
        
        except Exception as e:
            print(f"Model error: {str(e)}")
            return jsonify({"error": "AI model error", "details": str(e)}), 500
        
    except Exception as e:
        print(f"Dashboard metrics error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/journal/<entry_id>", methods=["PUT"])
def update_journal_entry(entry_id):
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json
        update_data = {
            "content": data.get("entry"),
            "mood": data.get("mood"),
            "sleep_hours": data.get("sleepHours"),
            "tags": data.get("tags", []),
            "updated_at": datetime.now()
        }
        
        # Update only if the entry belongs to the current user
        result = journal_collection.update_one(
            {"_id": ObjectId(entry_id), "user_id": user_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Entry not found or not owned by user"}), 404
            
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/journal/<entry_id>", methods=["DELETE"])
def delete_journal_entry(entry_id):
    try:
        user_id = get_user_id()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        
        # Delete only if the entry belongs to the current user
        result = journal_collection.delete_one({
            "_id": ObjectId(entry_id),
            "user_id": user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({"error": "Entry not found or not owned by user"}), 404
            
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)