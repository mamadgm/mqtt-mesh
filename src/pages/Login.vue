<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="w-full max-w-md p-6 space-y-4">
      <CardHeader>
        <CardTitle class="text-2xl">ورود</CardTitle>
        <CardDescription class="text-lg">اکانت و پسورد خود را وارد کنید</CardDescription>
      </CardHeader>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <Input v-model="phone" placeholder="شماره تلفن" />
        <Input v-model="password" type="password" placeholder="رمز عبور" />
        <Button type="submit" class="w-full text-2xl p-6" :disabled="loading">
          {{ loading ? "صبرکنید..." : "ورود" }}
        </Button>
      </form>
      <p v-if="error" class="text-red-500 text-sm font-bold text-left">{{ error }}</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { login } from "@/lib/api";
import { useRouter } from "vue-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const phone = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();

async function handleLogin() {
  error.value = "";
  loading.value = true;
  try {
    const token = await login(phone.value, password.value);
    localStorage.setItem("auth_access_token", token.access_token);
    router.push("/");
  } catch (err: any) {
    error.value = "Invalid credentials.";
  } finally {
    loading.value = false;
  }
}
</script>
