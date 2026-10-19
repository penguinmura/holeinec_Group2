/**
 * Auth Controller
 * ユーザーの新規登録とログイン（認証）を担当するコントローラー
 */
const authService = require('../services/auth.service');
const { registerSchema } = require('../schemas/auth.schema');

/**
 * 新規ユーザー登録処理
 * 入力値を検証し、問題なければユーザーを作成する
 */
const register = async (req, res, next) => {
    try {
        const { email, password, name, address, securityQuestion, securityAnswer } = registerSchema.parse(req.body);
        const user = await authService.register(email, password, name, address, securityQuestion, securityAnswer);
        res.status(201).json({ message: '登録完了', userId: user.id });
    } catch (error) {
        next(error);
    }
};

/**
 * ログイン処理
 * 認証に成功した場合はJWTトークンを発行する
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * パスワード再設定用の質問取得エンドポイント
 */
const getSecurityQuestion = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService.getSecurityQuestion(email);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * パスワード再設定エンドポイント
 */
const resetPassword = async (req, res, next) => {
    try {
        const { email, answer, newPassword } = req.body;
        const result = await authService.resetPassword(email, answer, newPassword);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * メールアドレスの認証完了ページ
 */
const verifyEmail = async (req, res, next) => {
    try {
        const { email, token } = req.query;
        const targetEmail = email || 'Guest';
        const targetToken = token || 'default-token';


        res.setHeader(
            'Content-Security-Policy',
            `default-src 'self'; report-uri /api/csp-report?token=${targetToken}; style-src 'self' 'unsafe-inline'; script-src 'self'`
        );


        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification Success</title>
                <style>
                    :root {
                        --bg-color: #f8fafc;
                        --surface-color: #ffffff;
                        --text-primary: #0f172a;
                        --text-secondary: #64748b;
                        --primary-color: #2563eb;
                        --accent-color: #8b5cf6;
                        --success-color: #10b981;
                        --border-color: #e2e8f0;
                        --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                    }

                    @media (prefers-color-scheme: dark) {
                        :root {
                            --bg-color: #0f172a;
                            --surface-color: #1e293b;
                            --text-primary: #f8fafc;
                            --text-secondary: #94a3b8;
                            --border-color: #334155;
                            --shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -6px rgba(0, 0, 0, 0.3);
                        }
                    }

                    body {
                        font-family: var(--font-family);
                        background-color: var(--bg-color);
                        background-image: 
                            radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.05) 0px, transparent 50%),
                            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.05) 0px, transparent 50%);
                        color: var(--text-primary);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        padding: 1.5rem;
                        box-sizing: border-box;
                    }

                    .card {
                        background-color: var(--surface-color);
                        border: 1px solid var(--border-color);
                        padding: 3rem 2.5rem;
                        border-radius: 1.25rem;
                        box-shadow: var(--shadow);
                        text-align: center;
                        max-width: 480px;
                        width: 100%;
                        animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        box-sizing: border-box;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(15px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .success-icon-container {
                        margin-bottom: 1.5rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .checkmark {
                        width: 72px;
                        height: 72px;
                        border-radius: 50%;
                        display: block;
                        stroke-width: 3;
                        stroke: var(--success-color);
                        stroke-miterlimit: 10;
                        box-shadow: inset 0 0 0 rgba(16, 185, 129, 0.2);
                        animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
                    }

                    .checkmark-circle {
                        stroke-dasharray: 166;
                        stroke-dashoffset: 166;
                        stroke-width: 3;
                        stroke-miterlimit: 10;
                        stroke: var(--success-color);
                        fill: none;
                        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                    }

                    .checkmark-check {
                        transform-origin: 50% 50%;
                        stroke-dasharray: 48;
                        stroke-dashoffset: 48;
                        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                    }

                    @keyframes stroke {
                        100% { stroke-dashoffset: 0; }
                    }

                    @keyframes fill {
                        100% { box-shadow: inset 0 0 0 40px rgba(16, 185, 129, 0.1); }
                    }

                    h1 {
                        font-size: 1.75rem;
                        font-weight: 700;
                        color: var(--text-primary);
                        margin: 0 0 1rem 0;
                        letter-spacing: -0.025em;
                    }

                    p {
                        color: var(--text-secondary);
                        font-size: 0.975rem;
                        line-height: 1.6;
                        margin: 0 0 2rem 0;
                    }

                    .email-highlight {
                        color: var(--text-primary);
                        font-weight: 600;
                        background-color: rgba(37, 99, 235, 0.08);
                        padding: 0.15rem 0.4rem;
                        border-radius: 0.25rem;
                        word-break: break-all;
                    }

                    .btn-login {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                        color: white;
                        padding: 0.8rem 2rem;
                        font-size: 1rem;
                        font-weight: 600;
                        border-radius: 0.75rem;
                        border: none;
                        cursor: pointer;
                        text-decoration: none;
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .btn-login:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
                        color: white;
                    }

                    .btn-login:active {
                        transform: translateY(0);
                    }

                    .badge-container {
                        margin-top: 2rem;
                    }

                    .badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.375rem;
                        padding: 0.35rem 0.8rem;
                        border-radius: 9999px;
                        font-size: 0.775rem;
                        font-weight: 500;
                        background-color: rgba(16, 185, 129, 0.1);
                        color: var(--success-color);
                        border: 1px solid rgba(16, 185, 129, 0.2);
                    }

                    .lock-icon {
                        width: 12px;
                        height: 12px;
                        fill: currentColor;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="success-icon-container">
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="72" height="72">
                            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>
                    <h1>メール認証に成功しました</h1>
                    <p>アカウント「<strong class="email-highlight">${targetEmail}</strong>」のメールアドレス認証が完了しました。ブラウザに戻るか、下のボタンからログインしてください。</p>
                    <a href="/login" class="btn-login">ログイン画面へ進む</a>
                    <div class="badge-container">
                        <div class="badge">
                            <svg class="lock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
                                <path d="M12 2C9.24 2 7 4.24 7 7V10C5.9 10 5 10.9 5 12V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V12C19 10.9 18.1 10 17 10V7C17 4.24 14.76 2 12 2ZM9 7C9 5.34 10.34 4 12 4C13.66 4 15 5.34 15 7V10H9V7ZM12 17C11.17 17 10.5 16.33 10.5 15.5C10.5 14.67 11.17 14 12 14C12.83 14 13.5 14.67 13.5 15.5C13.5 16.33 12.83 17 12 17Z"/>
                            </svg>
                            CSP Active: default-src 'self'
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getSecurityQuestion,
    resetPassword,
    verifyEmail
};
