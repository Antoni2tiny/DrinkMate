import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, sizes } from '../../utils';

export default function Login(){

    const handleLogin= () =>{
        console.log('Iniciar sesion');
        
    }

    return (
        <View style={styles.container}>
            <Text>Bienvenidos</Text>
            <TextInput style={styles.input}
            placeholder='email'/>
            <TextInput style={styles.input}
            placeholder='contraseña'/>
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