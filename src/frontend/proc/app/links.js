import HomeIcon from "@mui/icons-material/Home";
import {People} from "@mui/icons-material";

const LINKS = [
    {text: 'Home', href: '/', icon: HomeIcon},
    {text: 'Players By Age', href: '/players_age', icon: People },
    {text: 'Players By Country', href: '/players_country', icon: People },
    {text: 'Players By Team', href: '/players_team', icon: People },
    {text: 'Players By Overall Rank', href: '/players_overall_rank', icon: People },
    {text: 'Players By Competitor ID', href: '/players_competitor_id', icon: People },
    {text: 'Group Players', href: '/group_players', icon: People }
];
export default LINKS;