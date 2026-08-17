import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SystemTheme } from '../../theme/SystemTheme';
import Svg, { Pattern, Rect, Line, Defs } from 'react-native-svg';

export default function ScanlineBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base Dark Color */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: SystemTheme.colors.background }]} />

      {/* Grid Pattern using SVG */}
      <Svg height="100%" width="100%">
        <Defs>
          <Pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <Rect width="40" height="40" fill="none" />
            <Line x1="0" y1="0" x2="0" y2="40" stroke="rgba(0, 219, 231, 0.05)" strokeWidth="1" />
            <Line x1="0" y1="0" x2="40" y2="0" stroke="rgba(0, 219, 231, 0.05)" strokeWidth="1" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid)" />
      </Svg>
    </View>
  );
}
