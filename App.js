import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, TouchableOpacity, Alert, Button } from 'react-native';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const getQuizzes = async () => {
    try {
      const response = await fetch('https://8689-182-2-41-142.ngrok-free.app/api/quizzes/');
      const json = await response.json();
      setData(json.dataQuiz);
      initializeSelectedAnswers(json.dataQuiz);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSelectedAnswers = (quizzes) => {
    const initialAnswers = {};
    quizzes.forEach((quiz) => {
      initialAnswers[quiz.id] = null;
    });
    setSelectedAnswers(initialAnswers);
  };

  useEffect(() => {
    getQuizzes();
  }, []);

  const handleAnswerPress = (quizId, selectedOption) => {
    const updatedAnswers = { ...selectedAnswers, [quizId]: selectedOption };
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmitPress = () => {
    const correctCount = calculateCorrectAnswers();
    setCorrectCount(correctCount);
    setSubmitted(true);
  };

  const handleRefreshPress = () => {
    setCorrectCount(0);
    setSubmitted(false);
    initializeSelectedAnswers(data);
  };

  const calculateCorrectAnswers = () => {
    let count = 0;
    data.forEach((quiz) => {
      const selectedOption = selectedAnswers[quiz.id];
      if (selectedOption && selectedOption === quiz.key) {
        count++;
      }
    });
    return count;
  };

  const renderOptionButton = (quiz, option) => (
    <TouchableOpacity
      key={option}
      onPress={() => handleAnswerPress(quiz.id, option)}
      style={{
        backgroundColor: selectedAnswers[quiz.id] === option ? '#fce4ec' : '#fff',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
      }}
    >
      <Text style={{ fontSize: 16 }}>{`${option}. ${quiz[option]}`}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>{item.quiz}</Text>
      {['a', 'b', 'c', 'd'].map(option => renderOptionButton(item, option))}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Quiz</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={({ id }) => String(id)}
            renderItem={renderItem}
          />
          {submitted ? (
            <>
              <Button title="Refresh" onPress={handleRefreshPress} color="#808080" />
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  Jawaban Benar: {correctCount} dari {data.length}
                </Text>
              </View>
            </>
          ) : (
            <Button title="Submit" onPress={handleSubmitPress} color="#808080" />
          )}
        </>
      )}
    </View>
  );
};

export default App;
