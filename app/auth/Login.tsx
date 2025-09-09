import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { colors, sizes } from '../../utils';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin= () =>{
        console.log('Iniciar sesion');
    }

    return (
        <View style={styles.container}>
            <Text>Bienvenidos</Text>
            <TextInput style={styles.input}
            placeholder='email'
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
            keyboardType='email-address'
            />
            <TextInput style={styles.input}
            placeholder='contraseña'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
            <Pressable onPress={handleLogin}>
                <Text>
                iniciar sesion
                </Text>
            </Pressable>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgoundColor, 
        fontSize: sizes.titulo
    },
    input: {
        borderBottomWidth: 1,
        marginTop: 10,
        minWidth: 250
    }
})