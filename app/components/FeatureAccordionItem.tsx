import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../../utils';

interface Props {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  expanded: boolean;
  onToggle: (id: string) => void;
}

export default function FeatureAccordionItem({ id, title, icon, description, expanded, onToggle }: Props) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: expanded ? 1 : 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: expanded ? 1 : 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [expanded]);

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 72], // altura aproximada para dos líneas + padding
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => onToggle(id)} activeOpacity={0.8}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.muted} />
      </TouchableOpacity>
      <Animated.View style={[styles.body, { height: animatedHeight, opacity: opacityAnim }]}> 
        {expanded && (
          <Text style={styles.description} numberOfLines={3}>{description}</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.darkSurface,
    borderRadius: sizes.borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: sizes.margin.small,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.padding.medium,
    paddingHorizontal: sizes.padding.medium,
    gap: sizes.margin.small,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: sizes.medium,
    fontWeight: '600',
    color: colors.darkText,
  },
  body: {
    paddingHorizontal: sizes.padding.medium,
    paddingBottom: sizes.padding.medium,
  },
  description: {
    fontSize: sizes.small,
    lineHeight: 18,
    color: colors.muted,
  },
});
