import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

import { useChangePasswordMutation } from "../api/authApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCredentials } from "../authSlice";

const ForcePasswordChangePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);

  const [changePassword, { isLoading, isError, error }] =
    useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const serverError = useMemo(() => {
    const errAny = error as any;
    return errAny?.data?.message || "שגיאה בעדכון הסיסמה";
  }, [error]);

  const header = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-lock" />
      <span>החלפת סיסמה ראשונית</span>
    </div>
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword || !confirm) {
      setClientError("יש למלא סיסמה ישנה, סיסמה חדשה ואימות סיסמה");
      return;
    }
    if (newPassword !== confirm) {
      setClientError("האימות אינו תואם לסיסמה החדשה");
      return;
    }
    if (newPassword.length < 6) {
      setClientError("הסיסמה קצרה מדי (מומלץ לפחות 6 תווים)");
      return;
    }

    await changePassword({ oldPassword, newPassword }).unwrap();

    // עדכון store: isFirstLogin=false
    if (token && user) {
      dispatch(
        setCredentials({
          token,
          user: { ...user, isFirstLogin: false },
        })
      );
    }

    setSuccess("הסיסמה עודכנה בהצלחה");

    // מעבר לפי role
    const target =
      user?.role === "admin"
        ? "/admin"
        : user?.role === "principal"
        ? "/principal"
        : "/teacher";

    navigate(target, { replace: true });
  };

  return (
    <div className="flex justify-content-center" style={{ margin: "5%", direction: "rtl" }}>
      <Card title="ברוכה הבאה!" subTitle="בכניסה ראשונה חובה להגדיר סיסמה חדשה" header={header} className="w-full md:w-25rem">
        <form className="flex flex-column gap-3" onSubmit={onSubmit} dir="rtl">
          {clientError ? <Message severity="warn" text={clientError} /> : null}
          {isError ? <Message severity="error" text={String(serverError)} /> : null}
          {success ? <Message severity="success" text={success} /> : null}

          <div className="flex flex-column gap-2">
            <label htmlFor="oldPassword">סיסמה ישנה</label>
            <Password
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              feedback={false}
              toggleMask
              style={{ width: "100%" }}
              inputStyle={{ width: "100%" }}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="newPassword">סיסמה חדשה</label>
            <Password
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              feedback={false}
              toggleMask
              style={{ width: "100%" }}
              inputStyle={{ width: "100%" }}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="confirmPassword">אימות סיסמה</label>
            <Password
              id="confirmPassword"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              feedback={false}
              toggleMask
              style={{ width: "100%" }}
              inputStyle={{ width: "100%" }}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            label="שמור והמשך"
            icon="pi pi-check"
            loading={isLoading}
          />
        </form>
      </Card>
    </div>
  );
};

export default ForcePasswordChangePage;
