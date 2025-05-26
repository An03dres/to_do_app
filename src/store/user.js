// /store/user.js

import { defineStore } from 'pinia';
import { supabase } from '../supabase';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),

  actions: {
    async fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      this.user = user;
    },
    async signIn(email, password) {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) this.user = data.user;
      return { error };
    },
    async signUp(email, password) {
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (!error) this.user = data.user;
      return { error };
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      this.user = null;
      return { error };
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage
      }
    ]
  }
});
