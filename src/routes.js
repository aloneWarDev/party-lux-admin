import {
  faChartPie,
  faSignInAlt,
  faUser,
  faList,
  faUserCog,
  faGamepad,
  faUsers,
  faRetweet,
  faListAlt,
  faEye,
  faPencilAlt,
  faDatabase,
  faEnvelope,
  faChess,
  faPalette,
  faTasks,
  faNewspaper,
  faTrophy,
  faQuestion,
  faHeadset,
  faCog,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

//importing layouts....
import Admin from 'layouts/Admin';
import UnAuth from 'layouts/Auth';

import Dashboard from "views/Dashboard.js";
// import WebSdk from 'views/WebSdk.js'
import Login from "./views/Login/Login";
import Users from "./views/Users/Users"
import SiteSettings from "views/Settings/SiteSettings";
import LevelSettings from "views/Settings/LevelSettings";
import TrophySettings from "views/Settings/TrophySettings";
import SocialSettings from "views/Settings/SocialSettings";
import GameLinkSettings from "views/Settings/GameLinkSettings";
import Faq from "views/Faq/Faq";
import AddFaq from "views/Faq/AddFaq"
import EditFaq from 'views/Faq/EditFaq';
import Games from "./views/Games/Games"
import Genres from "./views/Genres/Genres"
import EmailTemplates from "views/EmailTemplates/EmailTemplates";
import Profile from 'views/Profile/profile'
import Unauth from 'layouts/Auth';
import EmailTemplate from 'views/EmailTemplates/EmailTemplate';
import ForgotPassword from 'views/ForgotPassword/ForgotPassword';
import ResetPassword from 'views/ResetPassword/ResetPassword';
import Contacts from 'views/Contacts/Contacts';
import Activity from 'views/Activity/Activity';
import Permissions from 'views/AdminStaff/permissions/permissionsListingComponent'
import Staff from 'views/AdminStaff/staff/staffListingComponent'
import ContentManagement from 'views/ContentManagment/contentManagement';
import AddContentPage from 'views/ContentManagment/addContentPage';
import AddTheme from 'views/Themes/AddTheme';
import Theme from 'views/Themes/Theme';
import News from 'views/News/News';
import Tournament from 'views/Tournament/Tournament';
import Learnings from 'views/LearningCenterManagement/learning';
import AddLearning from 'views/LearningCenterManagement/AddLearning';
import EditLearning from 'views/LearningCenterManagement/EditLearning';
import AddNews from 'views/News/AddNews';
import Rewards from 'views/Rewards/Rewards';
import Promos from 'views/Promos/Promos';
import ReportPlayer from 'views/ReportPlayer/ReportPlayer';
import AddPromos from 'views/Promos/AddPromos'
import AddReward from 'views/Rewards/AddReward';
//Support Management
import PlayerSupport from 'views/Support/Player';
import DeveloperSupport from 'views/Support/Dev';
//User management
import SimpleUser from 'views/UserManagement/SimpleUser';
import BusinessUser from 'views/UserManagement/BusinessUser';
//Faq management
import FaqCategories from './views/Faq/FaqCategories';
//Sdk
import Sdk from 'views/Sdk/Sdk';
//Game
import EditGame from 'views/Games/EditGame';
import ViewGame from 'views/Games/ViewGame';
import GameTheme from 'views/Games/GameTheme';
//season
import Seasons from 'views/Seasons/Seasons';
//SyncTheme
import ThemeSync from 'views/ThemeSync/ThemeSync';
//tournament-participate
import PlayerParticipation from 'views/playerParticipation/PlayerParticipation'
import AddGame from 'views/Games/AddGame';
//matchStats
import MatchStats from 'views/MatchStats/MatchStats';




var routes = [
  {
    path: "/",
    layout: Unauth,
    name: "Login",
    icon: "nc-icon nc-chart-pie-35",
    faicon: faSignInAlt,
    access: true,
    exact: true,
    component: Login
  },
  {
    path: "/dashboard",
    layout: Admin,
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    faicon: faChartPie,
    access: true,
    exact: true,
    component: Dashboard,
    showInSideBar: true
  },
  {
    path: "/profile",
    layout: Admin,
    name: "Profile",
    icon: "nc-icon nc-circle-09",
    faicon: faUser,
    access: true, exact: true,
    component: Profile,
    showInSideBar: false,
  },
  // {
  //   collapse: true,
  //   name: "Admin Staff",
  //   state: "openAdminStaff",
  //   icon: "nc-icon nc-grid-45",
  //   faicon: faUser,
  //   showInSideBar: true,
  //   submenus: [
  //     {
  //       path: "/permissions",
  //       layout: Admin,
  //       name: "Permissions",
  //       icon: "nc-icon nc-grid-45",
  //       faicon: faList,
  //       access: true, exact: true,
  //       component: Permissions,
  //       showInSideBar: true,
  //     },
  //     {
  //       path: "/staff",
  //       layout: Admin,
  //       name: "Staff",
  //       icon: "nc-icon nc-grid-45",
  //       faicon: faUser,
  //       access: true, exact: true,
  //       component: Staff,
  //       showInSideBar: true,
  //     }
  //   ],
  // },
  {
    collapse: true,
    name: "User Management",
    state: "openAdminUsers",
    icon: "nc-icon nc-grid-45",
    faicon: faUserCog,
    showInSideBar: true,
    submenus: [
      {
        path: "/simple-users",
        layout: Admin,
        name: "Simple User",
        icon: "nc-icon nc-grid-45",
        faicon: faUser,
        access: true, exact: true,
        component: SimpleUser,
        showInSideBar: true,
      },
      {
        path: "/business-users",
        layout: Admin,
        name: "Business User",
        icon: "nc-icon nc-grid-45",
        faicon: faUser,
        access: true, exact: true,
        component: BusinessUser,
        showInSideBar: true,
      }
    ],
  },

  {
    path: "/users",
    layout: Admin,
    name: "Users",
    icon: "nc-icon nc-single-02",
    faicon: faUsers,
    access: true, exact: true,
    component: Users,
    showInSideBar: false,
  },
  {
    path:  "/events", // "/games",
    layout: Admin,
    name: "Events",
    icon: "nc-icon nc-controller-modern",
    faicon: faGamepad,
    access: true, exact: true,
    component: Games,
    showInSideBar: true,
  },
  {
    path: "/memberships" , //"/genres",
    layout: Admin,
    name: "MemberShip", //"Genres",
    icon: "nc-icon nc-controller-modern",
    faicon: faGamepad,
    access: true, exact: true,
    component: Genres,
    showInSideBar: true,
  },
  {
    path: "/wallets" , //"/sync-theme",
    layout: Admin,
    name: "Wallets", //"Request Sync Theme",
    icon: "nc-icon nc-palette",
    faicon: faRetweet,
    access: true, exact: true,
    component: ThemeSync,
    showInSideBar: false,
  },
  // {
  //   path: "/season",
  //   layout: Admin,
  //   name: "Seasons",
  //   icon: "nc-icon nc-grid-45",
  //   faicon: faListAlt,
  //   access: true, exact: true,
  //   component: Seasons,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/tournament-participation/:userId",
  //   layout: Admin,
  //   name: "Tournament Participation",
  //   access: true, exact: true,
  //   component: PlayerParticipation,
  // },
  // {
  //   path: "/player-participation-payment/:userId",
  //   layout: Admin,
  //   name: "Player Payment",
  //   access: true, exact: true,
  //   component: PlayerParticipation,
  // },
  // {
  //   path: "/refund/:userId",
  //   layout: Admin,
  //   name: "Refund",
  //   access: true, exact: true,
  //   component: PlayerParticipation,
  // },
  // {
  //   path: "/edit-game/:gameId",
  //   layout: Admin,
  //   name: "Edit Game",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faGamepad,
  //   access: true, exact: true,
  //   component: EditGame
  // },
  // {
  //   path: '/add-game',
  //   layout: Admin,
  //   name: "Add Game",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faEye,
  //   access: true, exact: true,
  //   component: AddGame
  // },
  // {
  //   path: "/view-game/:gameId",
  //   layout: Admin,
  //   name: "View Game",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faEye,
  //   access: true, exact: true,
  //   component: ViewGame
  // },
  // {
  //   path: "/game-theme/:gameId",
  //   layout: Admin,
  //   name: "Game Theme",
  //   icon: "nc-icon nc-cart-simple",
  //   faGamepad,
  //   access: true, exact: true,
  //   component: Theme,
  // },
  // {
  //   path: "/edit-gametheme/:gameThemeId",
  //   layout: Admin,
  //   name: "Edit Game Theme",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faPencilAlt,
  //   access: true, exact: true,
  //   component: AddTheme,
  // },
  // {
  //   path: "/game-tournament/:gameId",
  //   layout: Admin,
  //   name: "Game Tournament",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faGamepad,
  //   access: true, exact: true,
  //   component: Tournament,
  // },
  // // {
  // //   path: "/add-learning",
  // //   layout: Admin,
  // //   name: "Add Learning",
  // //   icon: "nc-icon nc-bulb-63",
  // //   access: true, exact: true,
  // //   // showInSideBar: true,
  // //   component: AddLearning,
  // // }
  // {
  //   path: "/sdk",
  //   layout: Admin,
  //   name: "SDK",
  //   icon: "nc-icon nc-settings-gear-64",
  //   faicon: faDatabase,
  //   access: true, exact: true,
  //   component: Sdk,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/tournament",
  //   layout: Admin,
  //   name: "Tournaments",
  //   icon: "nc-icon nc-scissors",
  //   access: true, exact: true,
  //   faicon: faChess,
  //   component: Tournament,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/email-templates",
  //   layout: Admin,
  //   name: "Email Templates",
  //   icon: "nc-icon nc-email-83",
  //   faicon: faEnvelope,
  //   access: true, exact: true,
  //   component: EmailTemplates,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/theme",
  //   layout: Admin,
  //   name: "Themes",
  //   icon: "nc-icon nc-palette",
  //   faicon: faPalette,
  //   access: true, exact: true,
  //   component: Theme,
  //   showInSideBar: false,
  // },
  // {
  //   path: "/learning-center",
  //   layout: Admin,
  //   name: "Learning Center Management",
  //   faicon: faTasks,
  //   icon: "nc-icon nc-align-center",
  //   access: true, exact: true,
  //   component: Learnings,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/add-learning",
  //   layout: Admin,
  //   name: "Add Learning",
  //   icon: "nc-icon nc-bulb-63",
  //   faicon: faTasks,
  //   access: true, exact: true,
  //   // showInSideBar: true,
  //   component: AddLearning,
  // },
  // {
  //   path: "/edit-learning/:learningId",
  //   layout: Admin,
  //   name: "Edit Learning",
  //   icon: "nc-icon nc-bulb-63",
  //   faicon: faTasks,
  //   access: true, exact: true,
  //   // showInSideBar: true,
  //   component: EditLearning,
  // },
  // {
  //   path: "/view-learning/:learningId",
  //   layout: Admin,
  //   name: "Edit Learning",
  //   icon: "nc-icon nc-bulb-63",
  //   faicon: faTasks,
  //   access: true, exact: true,
  //   // showInSideBar: true,
  //   component: EditLearning,
  // },
  // {
  //   path: "/add-theme",
  //   layout: Admin,
  //   name: "Add Theme",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faPalette,
  //   access: true, exact: true,
  //   // showInSideBar: true,
  //   component: AddTheme
  // },
  // {
  //   path: "/edit-theme/:themeId?",
  //   layout: Admin,
  //   name: "Edit Theme",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faPalette,
  //   access: true, exact: true,
  //   // showInSideBar: true,
  //   component: AddTheme
  // },
  // {
  //   path: "/view-theme/:themeId?",
  //   layout: Admin,
  //   name: "Edit Theme",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faPalette,
  //   access: true, exact: true,
  //   // showInSideBar: true,
  //   component: AddTheme
  // },
  // {
  //   path: "/news",
  //   layout: Admin,
  //   name: 'News',
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faNewspaper,
  //   access: true, exact: true,
  //   component: News,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/add-news",
  //   layout: Admin,
  //   name: 'Add News',
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faNewspaper,
  //   access: true, exact: true,
  //   component: AddNews
  // },
  // {
  //   path: "/view-news/:newsId?",
  //   layout: Admin,
  //   name: 'Edit News',
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faNewspaper,
  //   access: true, exact: true,
  //   component: AddNews
  // },
  // {
  //   path: "/edit-news/:newsId?",
  //   layout: Admin,
  //   name: 'Edit News',
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faNewspaper,
  //   access: true, exact: true,
  //   component: AddNews
  // },
  // // {
  // //   path: "/reward" ,
  // //   layout: Admin ,
  // //   name: "Rewards" ,
  // //   icon: "nc-icon nc-cart-simple" ,
  // //   faicon: faTrophy,
  // //   access: true , exact: true ,
  // //   component: Rewards, 
  // //   showInSideBar: true,
  // // },
  // {
  //   path: "/add-reward",
  //   layout: Admin,
  //   name: "Add Reward",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faTrophy,
  //   access: true, exact: true,
  //   component: AddReward
  // },
  // {
  //   path: "/edit-reward/:rewardId?",
  //   layout: Admin,
  //   name: "Edit Reward",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faTrophy,
  //   access: true, exact: true,
  //   component: AddReward
  // },
  // // {
  // //   path: "/promos" ,
  // //   layout: Admin ,
  // //   name: "Promos" ,
  // //   icon: "nc-icon nc-cart-simple" ,
  // //   faicon: faTrophy,
  // //   access: true , exact: true ,
  // //   component: Promos, 
  // //   showInSideBar: true,
  // // },
  // {
  //   path: "/report-player",
  //   layout: Admin,
  //   name: "Report Player",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faTrophy,
  //   access: true, exact: true,
  //   component: ReportPlayer,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/add-promo",
  //   layout: Admin,
  //   name: "Add Promos",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faTrophy,
  //   access: true, exact: true,
  //   component: AddPromos
  // },
  // {
  //   path: "/edit-promo/:promoId?",
  //   layout: Admin,
  //   name: "Edit Promos",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faTrophy,
  //   access: true, exact: true,
  //   component: AddPromos
  // },
  // {
  //   path: "/email-template/:emailId",
  //   layout: Admin,
  //   name: "Email Template",
  //   icon: "nc-icon nc-cart-simple",
  //   faicon: faEnvelope,
  //   access: true, exact: true,
  //   component: EmailTemplate,
  // },
  // {
  //   collapse: true,
  //   name: "Faq Management",
  //   state: "openAdminFaqs",
  //   icon: "nc-icon nc-grid-45",
  //   faicon: faQuestion,
  //   showInSideBar: true,
  //   submenus: [
  //     {
  //       path: "/faq",
  //       layout: Admin,
  //       name: "FAQS",
  //       icon: "nc-icon nc-grid-45",
  //       faicon: faQuestion,
  //       access: true, exact: true,
  //       component: Faq,
  //       showInSideBar: true,
  //     },
  //     {
  //       path: "/faq-categories",
  //       layout: Admin,
  //       name: "Faq Category",
  //       icon: "nc-icon nc-grid-45",
  //       faicon: faQuestion,
  //       access: true, exact: true,
  //       component: FaqCategories,
  //       showInSideBar: true,
  //     }
  //   ],
  // },
  // {
  //   path: "/faq-categories ",
  //   layout: Admin,
  //   name: "Faq Category",
  //   icon: "nc-icon nc-grid-45",
  //   access: true, exact: true,
  //   component: FaqCategories,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/faq",
  //   layout: Admin,
  //   name: "FAQS",
  //   icon: "nc-icon nc-bulb-63",
  //   access: true, exact: true,
  //   component: Faq,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/add-faq",
  //   layout: Admin,
  //   name: "Add Faq",
  //   icon: "nc-icon nc-bulb-63",
  //   faicon: faQuestion,
  //   access: true, exact: true,
  //   component: AddFaq,
  // },
  // {
  //   path: "/edit-faq/:faqId",
  //   layout: Admin,
  //   name: "Edit Faq",
  //   icon: "nc-icon nc-bulb-63",
  //   faicon: faQuestion,
  //   access: true, exact: true,
  //   component: EditFaq,
  // },
  // {
  //   path: "/cms",
  //   layout: Admin,
  //   name: "Content Management",
  //   icon: "nc-icon nc-bulb-63",
  //   faicon: faDatabase,
  //   access: true, exact: true,
  //   component: ContentManagement,
  //   showInSideBar: true,
  // },
  // {
  //   path: "/add-cms",
  //   layout: Admin,
  //   name: "Add Content",
  //   faicon: faDatabase,
  //   icon: "nc-icon nc-bulb-63",
  //   access: true, exact: true,
  //   component: AddContentPage,
  // },
  // {
  //   path: "/edit-cms/:contentId",
  //   layout: Admin,
  //   name: "Edit Content",
  //   faicon: faDatabase,
  //   icon: "nc-icon nc-bulb-63",
  //   access: true, exact: true,
  //   component: AddContentPage,
  // },
  // {
  //   path: "/matchStats",
  //   layout: Admin,
  //   name: "Match Stats",
  //   icon: "nc-icon nc-bulb-63",
  //   faicon: faDatabase,
  //   access: true, exact: true,
  //   component: MatchStats,
  //   showInSideBar: true,
  // },
  // {
  //   collapse: true,
  //   name: "Support",
  //   state: "openAdminSupport",
  //   icon: "nc-icon nc-grid-45",
  //   faicon: faHeadset,
  //   showInSideBar: true,
  //   submenus: [
  //     {
  //       path: "/developer-support",
  //       layout: Admin,
  //       name: "Developer Support",
  //       icon: "nc-icon nc-grid-45",
  //       faicon: faHeadset,
  //       access: true, exact: true,
  //       component: DeveloperSupport,
  //       showInSideBar: true,
  //     },
  //     {
  //       path: "/player-support",
  //       layout: Admin,
  //       name: "Player Support",
  //       icon: "nc-icon nc-grid-45",
  //       faicon: faHeadset,
  //       access: true, exact: true,
  //       component: PlayerSupport,
  //       showInSideBar: true,
  //     }
  //   ],
  // },
  // {
  //   path: "/contact",
  //   layout: Admin,
  //   name: "Contacts",
  //   icon: "nc-icon nc-send",
  //   faicon: faUsers,
  //   access: true, exact: true,
  //   component: Contacts,
  //   showInSideBar: false,
  // },
  // {
  //   path: "/activity",
  //   layout: Admin,
  //   name: "Activities",
  //   icon: "nc-icon nc-notes",
  //   faicon: faChartLine,
  //   access: true, exact: true,
  //   component: Activity,
  //   showInSideBar: true,
  // },
  {
    collapse: true,
    name: "Settings",
    state: "opensettings",
    icon: "nc-icon nc-settings-gear-64",
    faicon: faCog,
    showInSideBar: true,
    submenus: [
      {
        path: "/site-settings",
        layout: Admin,
        name: "Site Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        faicon: faCog,
        access: true, exact: true,
        component: SiteSettings,
        showInSideBar: true,
      },
      {
        path: "/level-settings",
        layout: Admin,
        name: "Level Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        faicon: faCog,
        access: true, exact: true,
        component: LevelSettings,
        showInSideBar: true,
      },
      {
        path: "/trophy-settings",
        layout: Admin,
        name: "Trophy Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        faicon: faCog,
        access: true, exact: true,
        component: TrophySettings,
        showInSideBar: true,
      },
      {
        path: "/social-settings",
        layout: Admin,
        name: "Social Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        faicon: faCog,
        access: true, exact: true,
        component: SocialSettings,
        showInSideBar: true,
      },
      {
        path: "/game-link-settings",
        layout: Admin,
        name: "Game Link Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        faicon: faCog,
        access: true, exact: true,
        component: GameLinkSettings,
        showInSideBar: true,
      }
    ],
  },
  {
    path: "/login",
    layout: UnAuth,
    name: "Login",
    mini: "LP",
    component: Login,
  },
  {
    path: "/forgot-password",
    layout: UnAuth,
    name: "Forgot Passowrd",
    mini: "FP",
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:adminId",
    layout: UnAuth,
    name: "Reset Passowrd",
    mini: "RP",
    component: ResetPassword,
  }
];

export default routes;
