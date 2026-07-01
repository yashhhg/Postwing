"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { googleLoginUrl, login, register } from "@/lib/api";

const NAV_ROUTES: Record<string, string> = {
  landing: "/",
  login: "/login",
  register: "/register",
  soon: "/coming-soon",
};

function animateVal(el: HTMLElement | null, to: number) {
  if (!el) return;
  const from = parseInt(el.textContent || "", 10);
  if (isNaN(from) || from === to) {
    el.textContent = String(to);
    return;
  }
  const dur = 480;
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = String(Math.round(from + (to - from) * ease(p)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function setBilling(annual: boolean) {
  const monthlyBtn = document.querySelector<HTMLElement>('[data-pw-bill="monthly"]');
  const annualBtn = document.querySelector<HTMLElement>('[data-pw-bill="annual"]');
  const active = { background: "#fff", color: "#14130F", boxShadow: "0 2px 8px rgba(20,19,15,.1)" };
  const idle = { background: "transparent", color: "#6E6A5F", boxShadow: "none" };
  const apply = (el: HTMLElement | null, s: typeof active) => {
    if (!el) return;
    el.style.background = s.background;
    el.style.color = s.color;
    el.style.boxShadow = s.boxShadow;
  };
  apply(monthlyBtn, annual ? idle : active);
  apply(annualBtn, annual ? active : idle);
  animateVal(document.getElementById("pw-pro-price"), annual ? 15 : 19);
  animateVal(document.getElementById("pw-agency-price"), annual ? 39 : 49);
  document
    .querySelectorAll<HTMLElement>(".pw-bill-suffix")
    .forEach((el) => (el.textContent = annual ? "/mo billed yearly" : "/mo"));
}

export default function PwInteractions() {
  const router = useRouter();

  useEffect(() => {
    // Scroll reveal (mirrors the design's IntersectionObserver).
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("pw-in");
              io!.unobserve(en.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
      );
      requestAnimationFrame(() => {
        document.querySelectorAll(".pw-reveal:not([data-io])").forEach((el) => {
          el.setAttribute("data-io", "");
          io!.observe(el);
        });
      });
    }

    function showError(form: HTMLFormElement, message: string) {
      let box = form.querySelector<HTMLElement>(".pw-error");
      if (!box) {
        box = document.createElement("div");
        box.className = "pw-error";
        form.insertBefore(box, form.firstChild);
      }
      box.textContent = message;
    }

    async function handleSubmit(form: HTMLFormElement) {
      const kind = form.getAttribute("data-pw-form");
      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const email = form.querySelector<HTMLInputElement>('input[type="email"]')?.value.trim() || "";
      const password = form.querySelector<HTMLInputElement>('input[type="password"]')?.value || "";
      const existing = form.querySelector<HTMLElement>(".pw-error");
      if (existing) existing.remove();
      if (submitBtn) submitBtn.disabled = true;
      try {
        if (kind === "register") {
          const name = form.querySelector<HTMLInputElement>('input[type="text"]')?.value.trim() || "";
          await register(name, email, password);
        } else {
          await login(email, password);
        }
        router.push("/coming-soon");
      } catch (err: any) {
        if (submitBtn) submitBtn.disabled = false;
        showError(form, err?.message || "Something went wrong. Please try again.");
      }
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const nav = target.closest<HTMLElement>("[data-pw-nav]");
      if (nav) {
        e.preventDefault();
        const dest = NAV_ROUTES[nav.getAttribute("data-pw-nav") || "landing"];
        if (dest) router.push(dest);
        return;
      }
      const google = target.closest<HTMLElement>("[data-pw-google]");
      if (google) {
        e.preventDefault();
        window.location.href = googleLoginUrl();
        return;
      }
      const bill = target.closest<HTMLElement>("[data-pw-bill]");
      if (bill) {
        setBilling(bill.getAttribute("data-pw-bill") === "annual");
        return;
      }
    }

    function onSubmit(e: SubmitEvent) {
      const form = (e.target as HTMLElement)?.closest<HTMLFormElement>("[data-pw-form]");
      if (form) {
        e.preventDefault();
        handleSubmit(form);
      }
    }

    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);

    // Surface Google OAuth errors passed back via ?error=
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) {
      const map: Record<string, string> = {
        google_unavailable: "Google sign-in isn't configured yet. Please use email and password.",
        google_cancelled: "Google sign-in was cancelled. Please try again.",
      };
      const form = document.querySelector<HTMLFormElement>("[data-pw-form]");
      if (form) showError(form, map[err] || "Sign-in failed. Please try again.");
    }

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
      io?.disconnect();
    };
  }, [router]);

  return null;
}
