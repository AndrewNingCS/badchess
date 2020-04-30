import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import GavelIcon from "@material-ui/icons/Gavel";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
    sideBar: {
      background: "#3E5C76",
      width: "250px"
    },
    titleColor: {
        color: "#F0EBD8",
    },
    itemColor: {
        color: "#DAD5C6",
    },
    iconPadding: {
        paddingRight: "15px",
    },
}));

function SideBarItem(props) {
    const styles = useStyles();
    return (
        <Typography
            variant="h5"
            color="primary"
            classes={{ colorPrimary: styles.itemColor }}
        >
            {props.text}
        </Typography>
    )
}

function SideBar() {
    const styles = useStyles();
    return (
        <div className="sidebar">
            <Drawer 
                variant="permanent" 
                anchor="left" 
                classes={{ paper: styles.sideBar }}
            >
                <ListItem button component={Link} to="/">
                    <ListItemText>
                        <Typography 
                            variant="h4" 
                            align="center"
                            classes={{ colorPrimary: styles.titleColor }}
                            color="primary"
                        >
                            Bad Chess
                        </Typography>
                    </ListItemText>
                </ListItem>
                <List>
                    <ListItem button component={Link} to="/" key="Home">
                        <HomeIcon classes={{ root: styles.iconPadding }} htmlColor="#DAD5C6" />
                        <SideBarItem text="Home" />
                    </ListItem>
                    <ListItem button key="Rules">
                        <GavelIcon classes={{ root: styles.iconPadding }} htmlColor="#DAD5C6" />
                        <SideBarItem text="Rules" />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}

export default SideBar
