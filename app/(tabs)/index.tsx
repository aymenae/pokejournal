import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { nanoid } from 'nanoid/non-secure';
import { BlurView } from 'expo-blur';
import { JournalEntry } from '../types/JournalEntry'

const JOURNAL_FILE = `${FileSystem.documentDirectory}journal_entries.json`;

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [pokemonName, setPokemonName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setIsLoading(true);

      const fileInfo = await FileSystem.getInfoAsync(JOURNAL_FILE);

      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(JOURNAL_FILE);
        const parsedEntries: JournalEntry[] = JSON.parse(content);

        const sortedEntries = parsedEntries.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setEntries(sortedEntries);
      } else {
        await FileSystem.writeAsStringAsync(JOURNAL_FILE, JSON.stringify([]));
        setEntries([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load journal entries');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntriesToFile = async (updatedEntries: JournalEntry[]) => {
    try {
      await FileSystem.writeAsStringAsync(
        JOURNAL_FILE,
        JSON.stringify(updatedEntries)
      );
    } catch (error) {
      throw error;
    }
  };

  const saveEntry = async () => {
    if (!title.trim() || !text.trim() || !pokemonName.trim()) {
      Alert.alert('Missing Information', 'Please fill all fields');
      return;
    }

    try {
      const newEntry: JournalEntry = {
        id: nanoid(),
        title: title.trim(),
        text: text.trim(),
        timestamp: new Date().toISOString(),
        pokemonName: pokemonName.trim()
      };

      const updatedEntries = [newEntry, ...entries];
      await saveEntriesToFile(updatedEntries);

      setEntries(updatedEntries);
      setTitle('');
      setText('');
      setPokemonName('');
      setModalVisible(false);

      // Alert.alert('Success', 'Journal entry saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save journal entry');
      console.error(error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      await saveEntriesToFile(updatedEntries);
      setEntries(updatedEntries);
      // Alert.alert('Success', 'Journal entry deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete journal entry');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // form reset
  const closeModal = () => {
    setTitle('');
    setText('');
    setPokemonName('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My PokéJournal</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New PokéJournal Entry</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <BlurView intensity={70} style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.form}>
              <View style={styles.modalHeader}>
                <Text style={styles.formHeader}>New Journal Entry</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What happened today?"
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={4}
              />
              <TextInput
                style={styles.input}
                placeholder="Pokémon Name"
                value={pokemonName}
                onChangeText={setPokemonName}
              />
              <TouchableOpacity style={styles.button} onPress={saveEntry}>
                <Text style={styles.buttonText}>Save Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      <Text style={styles.sectionHeader}>Your Entries</Text>
      {isLoading ? (
        <Text style={styles.emptyText}>Loading entries...</Text>
      ) : entries.length === 0 ? (
        <Text style={styles.emptyText}>No journal entries yet. Create your first entry!</Text>
      ) : (
        <ScrollView style={styles.entriesList}>
          {entries.map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <TouchableOpacity
                  onPress={() => Alert.alert(
                    'Delete Entry',
                    'Are you sure you want to delete this entry?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', onPress: () => deleteEntry(entry.id), style: 'destructive' }
                    ]
                  )}
                >
                  <Text style={styles.deleteButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.entryDate}>{formatDate(entry.timestamp)}</Text>
              <Text style={styles.entryPokemon}>Pokémon: {entry.pokemonName}</Text>
              <Text style={styles.entryText}>{entry.text}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#25292e',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'monospace',
    color: '#FF7F50',
  },
  addButton: {
    backgroundColor: '#FF7F50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'transparent',
  },
  form: {
    backgroundColor: '#2f3542',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#fff',
  },
  closeButton: {
    fontSize: 20,
    color: '#FF7F50',
    padding: 4,
  },
  input: {
    backgroundColor: '#3d4353',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4a546a',
    color: '#fff',
    fontFamily: 'monospace',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FF7F50',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'monospace',
    color: '#fff',
  },
  entriesList: {
    flex: 1,
  },
  entryCard: {
    backgroundColor: '#2f3542',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    fontFamily: 'monospace',
    color: '#fff',
  },
  deleteButton: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
  },
  entryDate: {
    fontSize: 12,
    color: '#a0a0a0',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  entryPokemon: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF7F50',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  entryText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#fff',
    fontFamily: 'monospace',
  },
  emptyText: {
    textAlign: 'center',
    color: '#a0a0a0',
    padding: 20,
    fontFamily: 'monospace',
  },
});