import { useState, type ReactNode } from 'react';
import { MOCK_CURRENT_USER } from '@/mocks/users';
import type { User } from '@/types/user';
import { AuthContext } from './AuthContext';

/**
 * 2주차는 API 없이 UI만 구현하므로 로그인은 더미 사용자로 대체한다.
 * 3주차에 login/logout을 실제 API 호출로 바꾸면 사용하는 컴포넌트는 그대로 둘 수 있다.
 */
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => setUser(MOCK_CURRENT_USER);
  const logout = () => setUser(null);
  const updateUser = (changes: Partial<User>) =>
    setUser((prevUser) => (prevUser ? { ...prevUser, ...changes } : prevUser));

  return (
    <AuthContext value={{ user, isLoggedIn: user !== null, login, logout, updateUser }}>
      {children}
    </AuthContext>
  );
}

export default AuthProvider;
