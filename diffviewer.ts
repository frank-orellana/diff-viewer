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
import Vue from "./lib/vue/vue.esm.browser.min.js";
import i18n from "./lib/i18n.js";
import { diff } from "./lib/diff.js";

declare const ace: any;
declare const AceDiff: any;

i18n.langs.en = {
  pasteDiffHere: 'Paste your diff file here, and then press the "Process" button:',
  process: 'Process',
  new: 'New',
  deleted: 'Deleted',
  hide_show: 'Hide/Show Original diff file',
  filesInDiff: 'Files in diff file',
  viewInGithub: 'View in Github'
}

i18n.langs.es = {
  pasteDiffHere: 'Pegue su archivo diff aqui y luego presione el botón "Procesar":',
  process: 'Procesar',
  new: 'Nuevo',
  deleted: 'Eliminado',
  hide_show: 'Ocultar/Mostrar Archivo diff original',
  filesInDiff: 'Archivos en diff',
  viewInGithub: 'Ver en Github'
}

i18n.selectLang();

new Vue({
  el: '#app',
  data: {
    files: [],
    selectedFile: undefined,
    editor0: undefined,
    aceDiffer: undefined,
    editorA: undefined,
    editorB: undefined,
    i18n,
    show: { display: 'none' },
    modeList: ace.require("ace/ext/modelist")
  },
  methods: {
    process: function () {
      this.selectedFile = undefined;
      const lines: string[] = this.editor0.getValue().split('\n');

      this.files = [];
      const files = diff(lines);

      this.files = files;

      console.log(lines, this.files);
      this.selectedFile = 0;
      this.selectFile();
    },
    toggleOriginalDiff: function (e: Event) {
      e.preventDefault();
      document.getElementById("diff-file-div").classList.toggle('d-none');
    },
    selectFile: function(){
      this.editorA.setValue('', -1);
      this.editorB.setValue('', -1);

      if(this.selectedFile === undefined) return;

      console.log(this.selectedFile);
      const file = this.files[this.selectedFile];

      const mode = this.modeList.getModeForPath(file.name).mode;      
      console.log(file.name,mode);

      this.editorA.session.setMode(mode);
      this.editorB.session.setMode(mode);

      this.editorA.setValue(file.A.lines, -1);
      this.editorB.setValue(file.B.lines, -1);
    }
  },
  watch: {
    selectedFile: function () {
      this.selectFile();
    }
  },
  mounted: function () {
    this.aceDiffer = new AceDiff({
      element: '.custom',
      left: {
        content: '',
      },
      right: {
        content: '',
      },
      classes: {
        newCodeConnectorLinkContent: '&#8594;',
        deletedCodeConnectorLinkContent: '&#8592;',
      }
    });


    this.editor0 = ace.edit("editor0", { mode: "ace/mode/diff" , newLineMode: "unix"});


    const edA = this.aceDiffer.getEditors().left;
    const edB = this.aceDiffer.getEditors().right;
    this.editorA = edA;
    this.editorB = edB;

    edA.setTheme("ace/theme/crimson_editor");
    edA.session.setMode('ace/mode/jsp');
    edA.session.setUseWorker(false);
    edB.setTheme("ace/theme/crimson_editor");
    edB.session.setMode('ace/mode/jsp');
    edB.session.setUseWorker(false);

    edA.getSession().on('changeScrollTop', function (scroll) {
      edB.getSession().setScrollTop(parseInt(scroll) || 0)
    });
    edB.getSession().on('changeScrollTop', function (scroll) {
      edA.getSession().setScrollTop(parseInt(scroll) || 0)
    });

    edA.getSession().on('changeScrollLeft', function (scroll) {
      edB.getSession().setScrollLeft(parseInt(scroll) || 0)
    });
    edB.getSession().on('changeScrollLeft', function (scroll) {
      edA.getSession().setScrollLeft(parseInt(scroll) || 0)
    });

    this.show.display = 'block';
  }
});