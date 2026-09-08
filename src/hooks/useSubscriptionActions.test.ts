import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSubscriptionActions } from "./useSubscriptionActions";

const pauseSubscription = vi.fn();
const unpauseSubscription = vi.fn();
const cancelSubscriptionById = vi.fn();
const initiatePayment = vi.fn();
const submitPayment = vi.fn();

vi.mock("../lib/payfast", () => ({
  PayFastService: vi.fn().mockImplementation(() => ({
    pauseSubscription,
    unpauseSubscription,
    cancelSubscriptionById,
    initiatePayment,
    submitPayment,
  })),
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const successResponse = {
  data: {
    code: 200,
    status: "success",
    data: { response: true, message: "ok" },
  },
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function setup(overrides?: { subscription?: { id: string; payfast_token: string | null } | null }) {
  const refreshUserData = vi.fn().mockResolvedValue(undefined);
  const hook = renderHook(() =>
    useSubscriptionActions({
      user: { id: "user-1", email: "user@example.com" },
      userProfile: { first_name: "Jane", last_name: "Doe" },
      subscription:
        overrides && "subscription" in overrides
          ? overrides.subscription ?? null
          : { id: "sub-1", payfast_token: "token-123" },
      refreshUserData,
    })
  );
  return { ...hook, refreshUserData };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("pause", () => {
  it("calls payfast.pauseSubscription with the subscription token and toggles loading around the call", async () => {
    const { promise, resolve } = deferred<typeof successResponse>();
    pauseSubscription.mockReturnValue(promise);

    const { result } = setup();

    expect(result.current.loadingAction).toBeNull();

    let pausePromise!: Promise<void>;
    act(() => {
      pausePromise = result.current.pause();
    });

    await waitFor(() => expect(result.current.loadingAction).toBe("pause"));
    expect(pauseSubscription).toHaveBeenCalledWith("token-123");

    await act(async () => {
      resolve(successResponse);
      await pausePromise;
    });

    expect(result.current.loadingAction).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("surfaces an error from the mocked call in the hook's error state instead of throwing", async () => {
    pauseSubscription.mockRejectedValue(new Error("network down"));

    const { result } = setup();

    await act(async () => {
      await expect(result.current.pause()).resolves.toBeUndefined();
    });

    expect(result.current.loadingAction).toBeNull();
    expect(result.current.error).toBe("network down");
  });

  it("does not call payfast when there is no payfast token", async () => {
    const { result } = setup({ subscription: { id: "sub-1", payfast_token: null } });

    await act(async () => {
      await result.current.pause();
    });

    expect(pauseSubscription).not.toHaveBeenCalled();
    expect(result.current.error).toBe(
      "Cannot pause subscription: missing PayFast token"
    );
  });
});

describe("resume", () => {
  it("calls payfast.unpauseSubscription with the subscription token", async () => {
    unpauseSubscription.mockResolvedValue(successResponse);
    const { result, refreshUserData } = setup();

    await act(async () => {
      await result.current.resume();
    });

    expect(unpauseSubscription).toHaveBeenCalledWith("token-123");
    expect(refreshUserData).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it("surfaces a failure response as an error without throwing", async () => {
    unpauseSubscription.mockResolvedValue({
      data: { code: 400, status: "failed", data: { response: false, message: "nope" } },
    });
    const { result } = setup();

    await act(async () => {
      await expect(result.current.resume()).resolves.toBeUndefined();
    });

    expect(result.current.error).toBe("nope");
  });
});

describe("cancel", () => {
  it("calls payfast.cancelSubscriptionById with the token and subscription id", async () => {
    cancelSubscriptionById.mockResolvedValue(successResponse);
    const { result } = setup();

    await act(async () => {
      await result.current.cancel();
    });

    expect(cancelSubscriptionById).toHaveBeenCalledWith("token-123", "sub-1");
    expect(result.current.error).toBeNull();
  });

  it("only marks cancel as loading, not pause or resume", async () => {
    const { promise, resolve } = deferred<typeof successResponse>();
    cancelSubscriptionById.mockReturnValue(promise);

    const { result } = setup();

    let cancelPromise!: Promise<void>;
    act(() => {
      cancelPromise = result.current.cancel();
    });

    await waitFor(() => expect(result.current.loadingAction).toBe("cancel"));

    await act(async () => {
      resolve(successResponse);
      await cancelPromise;
    });

    expect(result.current.loadingAction).toBeNull();
  });
});
