import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Dimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import { colors, sizes } from '../../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');


// Definir los tipos de navegación
type RootStackParamList = {
    Home: undefined;
    Login: {
        userType?: 'usuario' | 'empresa';
    };
    Register: {
        userType?: 'usuario' | 'empresa';
    };
    UserTabs: undefined;
    EmpresaTabs: undefined;
    AuthManager: undefined;
    EmpresaAuthManager: undefined;
    // Agregar otras rutas según sea necesario
};

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LoginProps {
    route?: {
        params?: {
            userType?: 'usuario' | 'empresa';
        };
    };
}

export default function Login({ route }: LoginProps) {
    const [showPass, setShowPass] = useState<boolean>(true);
    const [userType, setUserType] = useState<'usuario' | 'empresa'>(
        route?.params?.userType || 'usuario'
    );

    const navigation = useNavigation<LoginNavigationProp>();

    interface IFormvalues {
        email: string;
        password: string;
    }

    const FormValidationSchema = Yup.object().shape({
        email: Yup.string().email("Email no tiene la forma adecuada").required('Email es requerido'),
        password: Yup.string().min(4, 'La contraseña debe tener al menos 4 caracteres').required('Contraseña es requerida')
    });

    const handleLogin = async (values: IFormvalues) => {
        try {
            console.log('Intentando login con:', values, 'Tipo:', userType);

            // Aquí iría la lógica de autenticación real
            // Por ahora simulamos un login exitoso

            // Navegar según el tipo de usuario seleccionado
            if (userType === 'usuario') {
                navigation.navigate('UserTabs');
            } else {
                navigation.navigate('EmpresaTabs');
            }
        } catch (error) {
            console.error('Error en login:', error);
            Alert.alert('Error', 'No se pudo iniciar sesión. Inténtalo de nuevo.');
        }
    };

    const goToRegister = () => {
        navigation.navigate('Register', { userType });
    };

    const goBack = () => {
        try {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Home');
            }
        } catch (error) {
            console.error('Error navegando hacia atrás:', error);
            navigation.navigate('Home');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* Header fijo */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Iniciar Sesión</Text>
                <View style={styles.placeholder} />
            </View>
            
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={true}
            >
                {/* Selector de tipo de usuario */}
                <View style={styles.userTypeSelector}>
                    <Text style={styles.selectorTitle}>Selecciona tu tipo de cuenta:</Text>
                    <View style={styles.selectorButtons}>
                        <TouchableOpacity
                            style={[
                                styles.selectorButton,
                                userType === 'usuario' && styles.selectorButtonActive
                            ]}
                            onPress={() => setUserType('usuario')}
                        >
                            <Ionicons
                                name="person"
                                size={20}
                                color={userType === 'usuario' ? colors.background : colors.primary}
                            />
                            <Text style={[
                                styles.selectorButtonText,
                                userType === 'usuario' && styles.selectorButtonTextActive
                            ]}>
                                Usuario
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.selectorButton,
                                userType === 'empresa' && styles.selectorButtonActive
                            ]}
                            onPress={() => setUserType('empresa')}
                        >
                            <Ionicons
                                name="business"
                                size={20}
                                color={userType === 'empresa' ? colors.background : colors.primary}
                            />
                            <Text style={[
                                styles.selectorButtonText,
                                userType === 'empresa' && styles.selectorButtonTextActive
                            ]}>
                                Empresa
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Formulario de login */}
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={FormValidationSchema}
                    onSubmit={handleLogin}
                >
                    {({ values, handleChange, handleSubmit, errors, touched, isValid }) => (
                        <View style={styles.formContainer}>
                            <View style={styles.logoSection}>
                                <Ionicons name="wine" size={48} color={colors.primary} />
                                <Text style={styles.appName}>DrinkMate</Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        touched.email && errors.email && styles.inputError
                                    ]}
                                    placeholder='Email'
                                    placeholderTextColor={colors.muted}
                                    value={values.email}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    onChangeText={handleChange("email")}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.error}>{errors.email}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            styles.passwordInput,
                                            touched.password && errors.password && styles.inputError
                                        ]}
                                        placeholder='Contraseña'
                                        placeholderTextColor={colors.muted}
                                        value={values.password}
                                        secureTextEntry={showPass}
                                        onChangeText={handleChange("password")}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowPass(!showPass)}
                                    >
                                        <Ionicons
                                            name={showPass ? "eye-off" : "eye"}
                                            size={20}
                                            color={colors.muted}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {touched.password && errors.password && (
                                    <Text style={styles.error}>{errors.password}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    !isValid && styles.loginButtonDisabled
                                ]}
                                onPress={() => handleSubmit()}
                                disabled={!isValid}
                            >
                                <Text style={styles.loginButtonText}>
                                    Iniciar Sesión como {userType === 'usuario' ? 'Usuario' : 'Empresa'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.registerLink} onPress={goToRegister}>
                                <Text style={styles.registerLinkText}>
                                    ¿No tienes cuenta? Regístrate aquí
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Math.max(16, width * 0.04),
        paddingVertical: sizes.padding.medium,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
    },
    backButton: {
        padding: sizes.padding.small,
    },
    headerTitle: {
        fontSize: sizes.large,
        fontWeight: 'bold',
        color: colors.text,
    },
    placeholder: {
        width: 40, // Para balancear el botón de regreso
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    userTypeSelector: {
        paddingHorizontal: Math.max(16, width * 0.04),
        paddingVertical: sizes.padding.large,
        backgroundColor: colors.surface,
        marginBottom: 0,
    },
    selectorTitle: {
        fontSize: sizes.medium,
        fontWeight: '600',
        color: colors.text,
        marginBottom: sizes.margin.medium,
        textAlign: 'center',
    },
    selectorButtons: {
        flexDirection: 'row',
        gap: sizes.margin.medium,
    },
    selectorButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: sizes.padding.medium,
        borderRadius: sizes.borderRadius.medium,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.background,
        gap: sizes.margin.small,
    },
    selectorButtonActive: {
        backgroundColor: colors.primary,
    },
    selectorButtonText: {
        fontSize: sizes.medium,
        fontWeight: 'bold',
        color: colors.primary,
    },
    selectorButtonTextActive: {
        color: colors.background,
    },
    formContainer: {
        paddingHorizontal: Math.max(20, width * 0.05),
        paddingVertical: sizes.padding.large,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: sizes.margin.xlarge,
    },
    appName: {
        fontSize: Math.min(32, width * 0.08),
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: sizes.margin.small,
    },
    inputContainer: {
        marginBottom: sizes.margin.large,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: sizes.borderRadius.medium,
        paddingHorizontal: sizes.padding.medium,
        paddingVertical: sizes.padding.medium,
        fontSize: sizes.medium,
        color: colors.text,
        backgroundColor: colors.background,
        minHeight: sizes.inputHeight,
    },
    inputError: {
        borderColor: colors.error,
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50, // Espacio para el botón del ojo
    },
    eyeButton: {
        position: 'absolute',
        right: sizes.padding.medium,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    error: {
        color: colors.error,
        fontSize: sizes.small,
        marginTop: sizes.margin.small,
    },
    loginButton: {
        backgroundColor: colors.primary,
        paddingVertical: sizes.padding.medium,
        borderRadius: sizes.borderRadius.medium,
        alignItems: 'center',
        marginTop: sizes.margin.medium,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    loginButtonDisabled: {
        backgroundColor: colors.muted,
        elevation: 0,
        shadowOpacity: 0,
    },
    loginButtonText: {
        fontSize: sizes.medium,
        fontWeight: 'bold',
        color: colors.background,
    },
    registerLink: {
        alignItems: 'center',
        marginTop: sizes.margin.large,
    },
    registerLinkText: {
        fontSize: sizes.medium,
        color: colors.primary,
        textDecorationLine: 'underline',
    },
})