import {
  checkEmailExists,
  confirmEmailSignup,
  confirmPasswordReset,
  loginWithEmail,
  loginWithGoogle,
  loginWithKakao,
  logout,
  requestPasswordReset,
  signupWithEmail,
} from "@/lib/api/auth";
import { server } from "@/mocks/server";

const BACKEND_URL = "http://localhost:8080";

beforeAll(() => {
  process.env.NEXT_PUBLIC_BACKEND_URL = BACKEND_URL;
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("auth API integration", () => {
  describe("checkEmailExists", () => {
    it("returns true for existing email", async () => {
      await expect(checkEmailExists("test@example.com")).resolves.toBe(true);
    });

    it("returns false for new email", async () => {
      await expect(checkEmailExists("fresh@example.com")).resolves.toBe(false);
    });

    it("throws for missing email", async () => {
      await expect(checkEmailExists("")).rejects.toThrow("이메일 파라미터가 필요합니다.");
    });
  });

  describe("loginWithGoogle", () => {
    it("returns access token for valid code", async () => {
      const response = await loginWithGoogle("valid-code");
      expect(response.accessToken).toContain("mock-jwt-token-user-4-");
    });

    it("throws for invalid code", async () => {
      await expect(loginWithGoogle("invalid-code")).rejects.toThrow("사용할 수 없는 구글 인증 코드입니다.");
    });
  });

  describe("loginWithKakao", () => {
    it("returns access token for valid code", async () => {
      const response = await loginWithKakao("valid-code");
      expect(response.accessToken).toContain("mock-jwt-token-user-3-");
    });

    it("throws for invalid code", async () => {
      await expect(loginWithKakao("invalid-code")).rejects.toThrow(
        "사용할 수 없는 카카오 인증 코드입니다. 카카오 인증 코드는 일회용이며, 인증 만료 시간은 10분입니다."
      );
    });
  });

  describe("signupWithEmail", () => {
    it("succeeds for new email", async () => {
      await expect(signupWithEmail("fresh@example.com", "password123456")).resolves.toBeUndefined();
    });

    it("throws for existing email", async () => {
      await expect(signupWithEmail("existing@example.com", "password123456")).rejects.toThrow(
        "이미 사용 중인 이메일입니다."
      );
    });
  });

  describe("confirmEmailSignup", () => {
    it("succeeds with valid code", async () => {
      await expect(confirmEmailSignup("newuser@example.com", "123456")).resolves.toBeUndefined();
    });

    it("throws for expired email", async () => {
      await expect(confirmEmailSignup("expired@example.com", "123456")).rejects.toThrow(
        "인증 시간이 만료되었거나 요청된 적 없는 이메일입니다."
      );
    });
  });

  describe("loginWithEmail", () => {
    it("returns access token for valid credentials", async () => {
      const response = await loginWithEmail("test@example.com", "password123456");
      expect(response.accessToken).toContain("mock-jwt-token-user-1-");
    });

    it("throws for invalid credentials", async () => {
      await expect(loginWithEmail("test@example.com", "wrongpassword")).rejects.toThrow(
        "이메일 로그인에 실패하였습니다. 이메일 또는 비밀번호를 확인해주세요."
      );
    });
  });

  describe("logout", () => {
    it("completes without error", async () => {
      await expect(logout()).resolves.toBeUndefined();
    });
  });

  describe("requestPasswordReset", () => {
    it("throws when requests are blocked", async () => {
      await expect(requestPasswordReset("blocked@example.com")).rejects.toThrow(
        "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요."
      );
    });
  });

  describe("confirmPasswordReset", () => {
    it("throws when no reset code exists", async () => {
      await expect(confirmPasswordReset("missing@example.com", "222222", "password123456")).rejects.toThrow(
        "비밀번호 재설정 요청이 만료되었거나 존재하지 않습니다."
      );
    });

    it("resets password after request", async () => {
      await expect(requestPasswordReset("responsive@test.com")).resolves.toBeUndefined();
      await expect(
        confirmPasswordReset("responsive@test.com", "222222", "newpassword123456")
      ).resolves.toBeUndefined();
    });
  });
});
