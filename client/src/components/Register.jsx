import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Auth.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('あなたの出身地は？');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/register', { email, password, name, address, securityQuestion, securityAnswer });
            setRegisteredEmail(email);
            setIsRegistered(true);
        } catch (err) {
            setError(err.response?.data?.error || '登録失敗');
        } finally {
            setLoading(false);
        }
    };

    if (isRegistered) {
        return (
            <div className="auth-container">
                <div className="auth-card" style={{ maxWidth: '600px', marginTop: '2rem', marginBottom: '2rem' }}>
                    <div className="auth-header">
                        <h2 className="auth-title" style={{ color: 'var(--success-color)' }}>登録申請を受け付けました</h2>
                        <p className="auth-subtitle">（開発・検証用メール送信シミュレータ）</p>
                    </div>
                    
                    <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem', textAlign: 'left' }}>
                        <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📨</span> 受信トレイ（シミュレーション）
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            本アプリは検証環境のため、実際にはメールは送信されません。代わりに、以下から認証用のリンクを選択してアクセスできます。本来は {(() => {
                                if (import.meta.env.DEV) {
                                    const hostname = window.location.hostname;
                                    if (hostname.endsWith('.github.dev')) {
                                        return `https://${hostname.replace('-5173', '-3000')}`;
                                    }
                                    return 'http://localhost:3000';
                                }
                                return window.location.origin;
                            })()}/api/auth/verify-email?token=mytoken&email=${encodeURIComponent(registeredEmail)} のようなリンクとなっています。
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                            <a 
                                href={`${(() => {
                                    if (import.meta.env.DEV) {
                                        const hostname = window.location.hostname;
                                        if (hostname.endsWith('.github.dev')) {
                                            return `https://${hostname.replace('-5173', '-3000')}`;
                                        }
                                        return 'http://localhost:3000';
                                    }
                                    return window.location.origin;
                                })()}/api/auth/verify-email`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ display: 'inline-block', fontSize: '0.95rem', padding: '0.6rem 1.5rem', textDecoration: 'none', width: '100%', textAlign: 'center' }}
                            >
                                メール認証を完了する
                            </a>
                        </div>
                    </div>

                    <div className="auth-footer" style={{ marginTop: '2rem' }}>
                        検証が完了しましたらログイン画面へお進みください。
                        <Link to="/login" className="auth-link" style={{ marginLeft: '0.5rem' }}>ログインへ</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '600px', marginTop: '2rem', marginBottom: '2rem' }}>
                <div className="auth-header">
                    <h2 className="auth-title">新規登録</h2>
                    <p className="auth-subtitle">新しくアカウントを作成します</p>
                </div>

                {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

                <form className="auth-form" onSubmit={handleRegister}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="auth-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="auth-label">メールアドレス *</label>
                            <input
                                type="email"
                                className="input-field auth-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="auth-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="auth-label">パスワード *</label>
                            <input
                                type="password"
                                className="input-field auth-input"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={8}
                                placeholder="8文字以上"
                            />
                        </div>

                        <div className="auth-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="auth-label">ユーザー名（任意）</label>
                            <input
                                type="text"
                                className="input-field auth-input"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="表示名を変更できます（後から変更可能）"
                            />
                        </div>

                        <div className="auth-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="auth-label">住所（任意）</label>
                            <input
                                type="text"
                                className="input-field auth-input"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="配送先住所（後から変更可能）"
                            />
                        </div>

                        <div className="auth-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="auth-label">秘密の質問 *</label>
                            <select 
                                className="input-field auth-input" 
                                value={securityQuestion} 
                                onChange={e => setSecurityQuestion(e.target.value)}
                                required
                            >
                                <option value="あなたの出身地は？">あなたの出身地は？</option>
                                <option value="最初の子どもの名前は？">最初の子どもの名前は？</option>
                                <option value="初めて買った車の車種は？">初めて買った車の車種は？</option>
                                <option value="好きな食べ物は？">好きな食べ物は？</option>
                            </select>
                        </div>

                        <div className="auth-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="auth-label">秘密の答え *</label>
                            <input
                                type="text"
                                className="input-field auth-input"
                                value={securityAnswer}
                                onChange={e => setSecurityAnswer(e.target.value)}
                                required
                                placeholder="パスワードリセット時に使用します"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-auth-submit" disabled={loading} style={{ marginTop: '2rem' }}>
                        {loading ? '登録中...' : 'アカウントを登録'}
                    </button>
                </form>

                <div className="auth-footer">
                    すでにアカウントをお持ちですか？
                    <Link to="/login" className="auth-link">ログイン</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
