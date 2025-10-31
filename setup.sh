#!/bin/bash

echo "🍹 Configurando DrinkMate..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

# Instalar Expo CLI si no está instalado
if ! command -v expo &> /dev/null; then
    echo "📦 Instalando Expo CLI..."
    npm install -g @expo/cli
else
    echo "✅ Expo CLI encontrado: $(expo --version)"
fi

# Instalar dependencias
echo "📦 Instalando dependencias del proyecto..."
npm install

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "Para iniciar el proyecto:"
echo "  npm start"
echo ""
echo "Para ejecutar en dispositivo específico:"
echo "  npm run android  # Android"
echo "  npm run ios      # iOS (solo macOS)"
echo "  npm run web      # Navegador web"
echo ""
echo "¡Feliz desarrollo! 🚀"