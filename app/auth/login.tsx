import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Card, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '../../components/AppContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { setUserType, setIsAuthenticated, setUser } = useApp();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    // Simular login
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock de validação
      if (email.includes('professor')) {
        setUserType('teacher');
        setIsAuthenticated(true);
        setUser({ name: 'Professor Silva', email: email });
        router.replace('/');
      } else if (email.includes('gestor')) {
        setUserType('manager');
        setIsAuthenticated(true);
        setUser({ name: 'Gestor Silva', email: email });
        router.replace('/manager/dashboard');
      } else {
        Alert.alert('Erro', 'Credenciais inválidas');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      // Simular autenticação Google
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock de seleção de tipo de usuário
      Alert.alert(
        'Selecionar Tipo de Usuário',
        'Escolha seu tipo de conta:',
        [
          {
            text: 'Professor',
            onPress: () => {
              setUserType('teacher');
              setIsAuthenticated(true);
              setUser({ name: 'Professor Google', email: 'professor@gmail.com' });
              router.replace('/');
            },
          },
          {
            text: 'Gestor',
            onPress: () => {
              setUserType('manager');
              setIsAuthenticated(true);
              setUser({ name: 'Gestor Google', email: 'gestor@gmail.com' });
              router.replace('/manager/dashboard');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Senha', 'Funcionalidade de recuperação será implementada');
  };

  const handleCreateAccount = () => {
    router.push('/auth/register' as any);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <MaterialIcons name="psychology" size={32} color="white" />
        </View>
        <Text style={styles.logoText}>Vetta</Text>
      </View>
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      <Text style={styles.subtitle}>
        Faça login para acessar sua conta e continuar de onde parou.
      </Text>
    </View>
  );

  const renderLoginForm = () => (
    <Card style={styles.formCard}>
      <Card.Content>
        <Text style={styles.formTitle}>Login</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            placeholder="seu@email.com"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            placeholder="Sua senha"
          />
        </View>

        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.loginButton}
          contentStyle={styles.loginButtonContent}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Card.Content>
    </Card>
  );

  const renderSocialLogin = () => (
    <View style={styles.socialContainer}>
      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.dividerText}>ou</Text>
        <Divider style={styles.divider} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleLogin}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <View style={styles.googleButtonContent}>
            <MaterialIcons name="hourglass-empty" size={20} color="#374151" />
            <Text style={styles.googleButtonText}>Conectando...</Text>
          </View>
        ) : (
          <View style={styles.googleButtonContent}>
                         <MaterialIcons name="language" size={20} color="#DB4437" />
            <Text style={styles.googleButtonText}>Continuar com Google</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Não tem uma conta?{' '}
        <TouchableOpacity onPress={handleCreateAccount}>
          <Text style={styles.footerLink}>Criar conta</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );

  const renderDemoAccounts = () => (
    <Card style={styles.demoCard}>
      <Card.Content>
        <Text style={styles.demoTitle}>Contas de Demonstração</Text>
        <Text style={styles.demoSubtitle}>
          Use estas credenciais para testar a aplicação:
        </Text>
        
        <View style={styles.demoAccounts}>
          <View style={styles.demoAccount}>
            <Text style={styles.demoLabel}>Professor:</Text>
            <Text style={styles.demoEmail}>professor@vetta.com</Text>
            <Text style={styles.demoPassword}>senha123</Text>
          </View>
          
          <View style={styles.demoAccount}>
            <Text style={styles.demoLabel}>Gestor:</Text>
            <Text style={styles.demoEmail}>gestor@vetta.com</Text>
            <Text style={styles.demoPassword}>senha123</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderHeader()}
        {renderLoginForm()}
        {renderSocialLogin()}
        {renderFooter()}
        {renderDemoAccounts()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  formCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    backgroundColor: '#3b82f6',
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  socialContainer: {
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 16,
    color: '#6b7280',
  },
  footerLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  demoCard: {
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  demoSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  demoAccounts: {
    gap: 16,
  },
  demoAccount: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  demoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  demoEmail: {
    fontSize: 14,
    color: '#374151',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2,
  },
  demoPassword: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
}); 