import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Save, BookOpen, Moon, ThumbsUp, Edit, Trash, ChevronDown, ChevronUp } from "lucide-react";
import PageTransition from '@/components/PageTransition';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JournalEntry {
  _id: string;
  content: string;
  mood: string;
  sleep_hours: number;
  tags: string[];
  created_at: string;
}

export default function Journal() {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [sleepHours, setSleepHours] = useState(8);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previousEntries, setPreviousEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<string[]>([]);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState('');
  const [editSleepHours, setEditSleepHours] = useState(8);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/journal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPreviousEntries(data.entries);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const saveEntry = async () => {
    if (!entry.trim() || !mood) {
      // Add validation feedback
      alert('Please fill in both entry and mood');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          entry,
          mood,
          sleepHours,
          tags: selectedTags
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save journal entry');
      }

      const data = await response.json();
      if (data.success) {
        // Clear form
        setEntry('');
        setMood('');
        setSleepHours(8);
        setSelectedTags([]);

        // Refresh entries
        await fetchJournalEntries();
        // Show success message
        alert('Journal entry saved successfully!');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (entryId: string) => {
    if (!editContent.trim() || !editMood) {
      alert('Please fill in both entry and mood');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/journal/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          entry: editContent,
          mood: editMood,
          sleepHours: editSleepHours,
          tags: editTags
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update journal entry');
      }

      // Refresh entries
      await fetchJournalEntries();
      // Exit edit mode
      setEditingEntry(null);
      // Show success message
      alert('Journal entry updated successfully!');
    } catch (error) {
      console.error('Error updating journal entry:', error);
      alert('Failed to update journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async () => {
    if (!entryToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/journal/${entryToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete journal entry');
      }

      // Close the dialog
      setDeleteDialogOpen(false);
      // Refresh entries
      await fetchJournalEntries();
      // Show success message
      alert('Journal entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      alert('Failed to delete journal entry. Please try again.');
    }
  };

  const startEditingEntry = (entry: JournalEntry) => {
    setEditingEntry(entry._id);
    setEditContent(entry.content);
    setEditMood(entry.mood);
    setEditSleepHours(entry.sleep_hours);
    setEditTags(entry.tags);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
  };

  const confirmDeleteEntry = (entryId: string) => {
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  const toggleExpand = (entryId: string) => {
    setExpandedEntries(prev =>
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const moodOptions = [
    { value: 'amazing', label: '😄 Amazing' },
    { value: 'good', label: '🙂 Good' },
    { value: 'okay', label: '😐 Okay' },
    { value: 'down', label: '😔 Down' },
    { value: 'stressed', label: '😫 Stressed' }
  ];

  const tagOptions = [
    'Work', 'Family', 'Health', 'Exercise', 'Learning',
    'Social', 'Hobby', 'Travel', 'Food', 'Goals'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev: string[]) =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleEditTag = (tag: string) => {
    setEditTags((prev: string[]) =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  interface SleepQualityColor {
    (hours: number): string;
  }
  const getSleepQualityColor: SleepQualityColor = (hours) => {
    if (hours < 4) return 'text-white bg-red-600 px-1 rounded';        // Dark Red with white text
    if (hours < 6) return 'text-black bg-orange-400 px-1 rounded';     // Orange with black text
    if (hours < 7) return 'text-black bg-yellow-400 px-1 rounded';     // Yellow with black text
    if (hours < 8) return 'text-black bg-blue-400 px-1 rounded';       // Light Blue with black text
    return 'text-white bg-green-600 px-1 rounded';                     // Dark Green with white text
};

  const truncateText = (text: string, length: number = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-cover bg-center pt-16"
        style={{ backgroundImage: 'url("/src/components/images/journal1.jpg")' }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Card */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-white">Daily Journal</CardTitle>
                  <div className="flex items-center gap-2 text-white/80">
                    <CalendarDays className="h-5 w-5" />
                    <span>{currentDate}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Mood and Sleep Tracking Card */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mood Selection */}
                  <div className="space-y-2">
                    <label className="text-white flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5" />
                      How are you feeling today?
                    </label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select your mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sleep Hours */}
                  <div className="space-y-2">
                    <label className="text-white flex items-center gap-2">
                      <Moon className="h-5 w-5" />
                      Hours of Sleep
                    </label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[sleepHours]}
                        onValueChange={([value]) => setSleepHours(value)}
                        max={12}
                        min={0}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className={`font-bold ${getSleepQualityColor(sleepHours)}`}>
                        {sleepHours}h
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Journal Entry Card */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4 text-white/80">
                  <BookOpen className="h-5 w-5" />
                  <p>Write your thoughts, feelings, and experiences...</p>
                </div>

                {/* Tags Selection */}
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-white/20"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Textarea
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Today I feel..."
                  className="min-h-[300px] bg-white/5 border-white/10 text-white placeholder:text-white/50 resize-none"
                />

                <div className="flex justify-end">
                  <Button
                    className="gap-2"
                    onClick={saveEntry}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Previous Entries Preview */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Previous Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previousEntries.map((entry) => (
                    <div key={entry._id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      {editingEntry === entry._id ? (
                        // Edit mode
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select value={editMood} onValueChange={setEditMood}>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select mood" />
                              </SelectTrigger>
                              <SelectContent>
                                {moodOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex items-center gap-4">
                              <Slider
                                value={[editSleepHours]}
                                onValueChange={([value]) => setEditSleepHours(value)}
                                max={12}
                                min={0}
                                step={0.5}
                                className="flex-1"
                              />
                              <span className={`font-bold ${getSleepQualityColor(editSleepHours)}`}>
                                {editSleepHours}h
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {tagOptions.map(tag => (
                              <Badge
                                key={tag}
                                variant={editTags.includes(tag) ? "default" : "outline"}
                                className="cursor-pointer hover:bg-white/20"
                                onClick={() => toggleEditTag(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[150px] bg-white/5 border-white/10 text-white resize-none"
                          />

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={cancelEditing}>
                              Cancel
                            </Button>
                            <Button
                              onClick={() => updateEntry(entry._id)}
                              disabled={loading}
                            >
                              {loading ? 'Updating...' : 'Update Entry'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <>
                          <div className="flex items-center justify-between">
                            <p className="text-white/80 text-sm">
                              {entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              }) : "No date"}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-white/80">
                                {moodOptions.find(m => m.value === entry.mood)?.label}
                              </span>
                              <span className={`${getSleepQualityColor(entry.sleep_hours)} text-sm`}>
                                <Moon className="h-4 w-4 inline mr-1" />
                                {entry.sleep_hours}h
                              </span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <p className={`text-white break-words ${expandedEntries.includes(entry._id) ? '' : 'truncate overflow-hidden'}`}>
                              {expandedEntries.includes(entry._id)
                                ? entry.content.split('\n').map((line, index) => (
                                  <div key={index} className="whitespace-pre-wrap break-words">{line}</div>
                                ))
                                : truncateText(entry.content, 100)}
                            </p>

                            {entry.content.length > 100 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpand(entry._id)}
                                className="mt-1 bg-white/20 text-white px-4 py-2 rounded-lg mb-6 hover:bg-white/30 transition-all"
                              >
                                {expandedEntries.includes(entry._id)
                                  ? <><ChevronUp className="h-4 w-4 mr-1 " /> Show Less</>
                                  : <><ChevronDown className="h-4 w-4 mr-1" /> Show More</>}
                              </Button>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {entry.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingEntry(entry)}
                              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDeleteEntry(entry._id)}
                              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
                            >
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will permanently delete your journal entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteEntry}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}