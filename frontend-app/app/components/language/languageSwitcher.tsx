"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Menu, MenuItem } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <>
      <Button
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        color="inherit"
        size="small"
      >
        {i18n.language === "en" ? "EN" : "BG"}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => changeLanguage("bg")}>
          {t("languages.bulgarian")}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("en")}>
          {t("languages.english")}
        </MenuItem>
      </Menu>
    </>
  );
}
