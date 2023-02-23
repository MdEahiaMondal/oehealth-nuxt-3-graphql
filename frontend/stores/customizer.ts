import { defineStore } from "pinia";

interface State {
  Sidebar_drawer: any;
  Customizer_drawer: boolean;
  SidebarColor: string;
  mini_sidebar: boolean;
  navbarColor: string;
  setHorizontalLayout: boolean;
  darktheme: boolean;
}

export const useCustomizerStore = defineStore({
  id: "customizer",
  state: (): State => ({
    Sidebar_drawer: null,
    Customizer_drawer: false,
    SidebarColor: "white", 
    mini_sidebar: false,
    navbarColor: "#1e88e5",
    setHorizontalLayout: false,
    darktheme: false,
  }),

  actions: {
    SET_SIDEBAR_DRAWER() {
      this.Sidebar_drawer = !this.Sidebar_drawer;
    },
    SET_MINI_SIDEBAR(payload: any) {
      this.mini_sidebar = payload;
    },
    SET_CUSTOMIZER_DRAWER(payload: any) {
      this.Customizer_drawer = payload;
    },
    SET_SIDEBAR_COLOR(payload: any) {
      this.SidebarColor = payload;
    },
    SET_NAVBAR_COLOR(payload: any) {
      this.navbarColor = payload;
    },
    SET_LAYOUT(payload: any) {
      this.setHorizontalLayout = payload;
    },
  },
});
