/*
Copyright 2019 Franklin Orellana

This file is part of DiffViewer.

DiffViewer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

DiffViewer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with DiffViewer.  If not, see <https://www.gnu.org/licenses/>. */
export default class i18n {
    static selectLang() {
        var language = window.navigator.languages[0];
        console.log(language);
        if (i18n.langs[language])
            i18n.msg = i18n.langs[language];
        else if (i18n.langs[language.substr(0, 2)])
            i18n.msg = i18n.langs[language.substr(0, 2)];
        else
            i18n.msg = i18n.langs['en'];
    }
}
i18n.langs = {};
