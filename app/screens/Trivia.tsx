import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils';

type TriviaQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
  category: 'Clásicos' | 'Amargos' | 'Tropicales';
};

export default function TriviaScreen() {
  const questions: TriviaQuestion[] = useMemo(() => ([
    {
      id: 'q1',
      question: '¿El fernet clásico se prepara con...?',
      options: ['Gin y tónica', 'Fernet y cola', 'Ron y limón', 'Vodka y naranja'],
      correctIndex: 1,
      hint: 'Una mezcla muy popular en Argentina.',
      category: 'Amargos',
    },
    {
      id: 'q2',
      question: 'Para un Mojito tradicional necesitas...',
      options: ['Ron, menta, lima, azúcar y soda', 'Tequila, sal y limón', 'Vodka, arándanos y lima', 'Whisky, vermut y bitter'],
      correctIndex: 0,
      hint: 'Refrescante y con menta fresca.',
      category: 'Tropicales',
    },
    {
      id: 'q3',
      question: '¿Qué licor es base del Negroni?',
      options: ['Tequila', 'Campari', 'Whisky', 'Cointreau'],
      correctIndex: 1,
      hint: 'Rojo amargo icónico.',
      category: 'Amargos',
    },
    {
      id: 'q4',
      question: '¿Qué se usa para "colar" un cóctel después de agitar?',
      options: ['Macerador', 'Jigger', 'Colador', 'Muddler'],
      correctIndex: 2,
      category: 'Clásicos',
    },
    {
      id: 'q5',
      question: 'Un Daiquiri clásico lleva...',
      options: ['Ron, lima y azúcar', 'Vodka, café y azúcar', 'Gin, limón y clara', 'Ron, ananá y coco'],
      correctIndex: 0,
      category: 'Clásicos',
    },
  ]), []);

  const categories = ['Todos', 'Clásicos', 'Amargos', 'Tropicales'] as const;
  type CategoryFilter = typeof categories[number];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todos');
  const [finished, setFinished] = useState(false);

  const filtered = useMemo(
    () => (selectedCategory === 'Todos' ? questions : questions.filter(q => q.category === selectedCategory)),
    [questions, selectedCategory]
  );

  useEffect(() => {
    // Reset state when category changes
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  }, [selectedCategory]);

  const current = filtered[currentIndex];
  const isLast = currentIndex === Math.max(filtered.length - 1, 0);

  function onSelect(optionIndex: number) {
    if (selectedIndex !== null) return;
    setSelectedIndex(optionIndex);
    const isCorrect = optionIndex === current.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('¡Excelente! ¡Acierto! 🥳');
    } else {
      setFeedback('¡Casi! Sigue intentando 💪');
    }
  }

  function onNext() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelectedIndex(null);
    setFeedback(null);
  }

  function onFinish() {
    setFinished(true);
  }

  function onRestart() {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/trivia.png')} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.overlay} />

        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={styles.headerBox}>
            <Text style={styles.title}>Trivia DrinkGo</Text>
            <Text style={styles.subtitle}>Pon a prueba tus conocimientos de coctelería</Text>
            <View style={styles.scorePill}><Text style={styles.scoreText}>Puntaje: {score}/{questions.length}</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
              {categories.map(cat => {
                const active = selectedCategory === cat;
                return (
                  <Pressable key={cat} onPress={() => setSelectedCategory(cat)} style={[styles.categoryChip, active ? styles.categoryChipActive : null]}>
                    <Text style={[styles.categoryText, active ? styles.categoryTextActive : null]}>{cat}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.card}>
            {finished ? (
              <View>
                <Text style={styles.level}>Resumen</Text>
                <Text style={styles.question}>¡Buen juego! Tu puntaje fue {score}/{filtered.length} en {selectedCategory}.</Text>
                <View style={styles.buttonsRow}>
                  <Pressable style={[styles.cta, styles.ctaPrimary]} onPress={onRestart}>
                    <Text style={styles.ctaPrimaryText}>Reiniciar</Text>
                  </Pressable>
                </View>
              </View>
            ) : filtered.length === 0 ? (
              <View>
                <Text style={styles.level}>Sin preguntas</Text>
                <Text style={styles.question}>No hay preguntas para esta categoría.</Text>
              </View>
            ) : (
              <>
                <Text style={styles.level}>Nivel {currentIndex + 1} de {filtered.length} · {selectedCategory}</Text>
                <Text style={styles.question}>{current.question}</Text>

                <View style={styles.options}>
                  {current.options.map((opt, idx) => {
                    const isChosen = selectedIndex === idx;
                    const isCorrect = idx === current.correctIndex;
                    const showState = selectedIndex !== null;
                    const backgroundColor = !showState
                      ? 'rgba(255,255,255,0.96)'
                      : isChosen && isCorrect
                        ? '#22c55e'
                        : isChosen && !isCorrect
                          ? '#ef4444'
                          : 'rgba(255,255,255,0.96)';
                    const textColor = showState && isChosen ? '#fff' : colors.primary;

                    return (
                      <Pressable key={idx} style={[styles.option, { backgroundColor }]} onPress={() => onSelect(idx)}>
                        <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                {feedback && (
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackText}>{feedback}</Text>
                    {current.hint && selectedIndex !== current.correctIndex && (
                      <Text style={styles.hintText}>Pista: {current.hint}</Text>
                    )}
                  </View>
                )}

                <View style={styles.buttonsRow}>
                  <Pressable style={[styles.cta, styles.ctaGhost]} onPress={onFinish}>
                    <Text style={styles.ctaGhostText}>Finalizar</Text>
                  </Pressable>
                  <Pressable style={[styles.cta, styles.ctaPrimary]} onPress={onNext}>
                    <Text style={styles.ctaPrimaryText}>{isLast ? 'Finalizar' : 'Siguiente'}</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bg: { flex: 1 },
  bgImage: { resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },

  headerBox: { paddingHorizontal: 16, paddingTop: 16 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#fff', marginTop: 6 },
  scorePill: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.92)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  scoreText: { color: colors.primary, fontWeight: '700' },
  categoriesRow: { gap: 8, paddingTop: 12, paddingBottom: 4 },
  categoryChip: { backgroundColor: 'rgba(255,255,255,0.85)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#EEF2FF', marginRight: 8 },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { color: colors.primary, fontWeight: '700' },
  categoryTextActive: { color: '#fff' },

  card: { margin: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2FF' },
  level: { color: colors.primary, fontWeight: '700', marginBottom: 8 },
  question: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  options: { gap: 10 },
  option: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2FF' },
  optionText: { fontWeight: '700' },

  feedbackBox: { marginTop: 10, backgroundColor: 'rgba(2,6,23,0.6)', padding: 12, borderRadius: 12 },
  feedbackText: { color: '#fff', fontWeight: '700' },
  hintText: { color: '#e2e8f0', marginTop: 4 },

  buttonsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cta: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minWidth: 130 },
  ctaPrimary: { backgroundColor: colors.primary },
  ctaPrimaryText: { color: '#fff', fontWeight: '700' },
  ctaGhost: { backgroundColor: 'rgba(255,255,255,0.95)' },
  ctaGhostText: { color: colors.primary, fontWeight: '700' },
});


