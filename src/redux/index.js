import { combineReducers } from 'redux'
import adminReducer from '../views/Admin/Admin.reducer'
import rolesReducer from '../views/AdminStaff/permissions/permissions.reducer'
import userReducer from 'views/UserManagement/UserManagement.reducer'
import errorReducer from './shared/error/error.reducer'
import emailReducer from '../views/EmailTemplates/EmailTemplates.reducer'
import settingsReducer from '.././views/Settings/settings.reducer'
import faqReducer from 'views/Faq/Faq.reducer'
import contactsReducer from 'views/Contacts/Contacts.reducer'
import ActivityReducer from 'views/Activity/Activity.reducer'
import DashboardReducer from 'views/Dashboard.reducer'
import ContentManagementReducer from 'views/ContentManagment/cms.reducer'
import ThemeReducer from 'views/Themes/Theme.reducer'
import GamesReducer from 'views/Games/Games.reducer'
import GenresReducer from 'views/Genres/Genre.reducer'
import TournamentReducer from 'views/Tournament/Tournament.reducer'
import LearningsReducer from 'views/LearningCenterManagement/learning.reducer'
import NewsReducer from 'views/News/News.reducer'
import RewardsReducer from 'views/Rewards/Rewards.reducer'
import Support from 'views/Support/Support.reducers'
import Sdk from 'views/Sdk/Sdk.reducer'
import Season from 'views/Seasons/Seasons.reducer'
import PromosReducer from 'views/Promos/Promos.reducer'
import PlayerReportReducer from 'views/ReportPlayer/ReportedPlayer.reducer'
import MatchStatsReducer from 'views/MatchStats/MatchStats.reducer'


export default combineReducers({
    admin: adminReducer,
    role: rolesReducer,
    user: userReducer,
    error: errorReducer,
    email: emailReducer,
    settings: settingsReducer,
    themes: ThemeReducer,
    news: NewsReducer,
    rewards : RewardsReducer,
    promos:PromosReducer,
    reports: PlayerReportReducer,
    supports : Support,
    sdks : Sdk,
    seasons : Season ,
    faqs: faqReducer,
    contacts: contactsReducer,
    activity: ActivityReducer,
    dashboard: DashboardReducer,
    content : ContentManagementReducer,
    game  :  GamesReducer,
    genre  :  GenresReducer,
    tournament:TournamentReducer,
    learnings:LearningsReducer,
    matchStats: MatchStatsReducer 
})