import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { setCredentials } from "../authSlice";
import { useLoginMutation } from "../api/authApi";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Message } from "primereact/message";

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [login, { isLoading, isError, error, isSuccess, data }] =
        useLoginMutation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // הודעת שגיאה ידידותית בעברית (401 וכו')
    const errorText = useMemo(() => {
        // ב-RTK Query error יכול להיות בכמה צורות
        const errAny = error as any;
        const serverMessage =
            errAny?.data?.message || errAny?.error || "שגיאה בהתחברות";
        return serverMessage === "Invalid credentials"
            ? "שם המשתמש או הסיסמה אינם נכונים"
            : String(serverMessage);
    }, [error]);

    useEffect(() => {
        if (!isSuccess || !data) return;

        // data = { token, user: { id, fullName, role, isFirstLogin, ... } }
        dispatch(setCredentials(data));
        // ניתוב למעבר סיסמה אם זה התחבר ראשון
        if (data.user.isFirstLogin) {
            navigate("/force-password-change", { replace: true });
            return;
        }
        // ניווט ראשוני לפי role (אפשר לשנות לפי מה שתגדירי ל-dashboard)
        if (data.user.role === "admin") navigate("/admin", { replace: true });
        else if (data.user.role === "principal")
            navigate("/principal", { replace: true });
        else navigate("/teacher", { replace: true });
    }, [isSuccess, data, dispatch, navigate]);

    const header = (
        <img
            alt="User"
            src="https://primefaces.org/cdn/primereact/images/usercard.png"
            style={{ width: "100%", objectFit: "cover" }}
        />
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ username, password }).unwrap();
    };

    return (
        <div
            className="flex justify-content-center"
            style={{ margin: "5%", direction: "rtl" }}
        >
            <Card
                title="כניסה למערכת"
                subTitle="אנא הכניסי פרטי משתמש"
                header={header}
                className="w-full md:w-25rem"
            >
                <form className="flex flex-column gap-3" onSubmit={handleSubmit} dir="rtl">
                    {isError ? <Message severity="error" text={errorText} /> : null}

                    <div className="flex flex-column gap-2">
                        <label htmlFor="username">שם משתמש</label>
                        <InputText
                            id="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: "100%" }}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="password">סיסמה</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            feedback={false}
                            toggleMask
                            style={{ width: "100%" }}
                            inputStyle={{ width: "100%" }}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        label={isLoading ? "מתחברת..." : "כניסה"}
                        icon="pi pi-sign-in"
                        loading={isLoading}
                    />

                    {/* כרגע אין לנו endpoint לשכחתי סיסמה במערכת הזו.
              אם תרצי - נבנה דיאלוג כמו בקובץ המצורף כשה-endpoint יהיה קיים. */}
                    <div className="flex justify-content-start">
                        <Link to="/forgot-password" style={{ textDecoration: "underline" }}>
                            שכחתי סיסמה
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
