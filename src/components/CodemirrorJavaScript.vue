<template>
	<codemirror ref="myEditor" v-model="code" :options="editorOptions"></codemirror>
</template>

<script>

import { codemirror, CodeMirror } from 'vue-codemirror'


// require active-line.js
require('codemirror/addon/selection/active-line.js')
// styleSelectedText
require('codemirror/addon/selection/mark-selection.js')
require('codemirror/addon/search/searchcursor.js')
// hint
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/javascript-hint.js')
require('codemirror/addon/selection/active-line.js')
// highlightSelectionMatches
require('codemirror/addon/scroll/annotatescrollbar.js')
require('codemirror/addon/search/matchesonscrollbar.js')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/search/match-highlighter.js')
// keyMap
require('codemirror/mode/clike/clike.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/comment/comment.js')
require('codemirror/addon/dialog/dialog.js')
require('codemirror/addon/dialog/dialog.css')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/search/search.js')
require('codemirror/keymap/sublime.js')
// foldGutter
require('codemirror/addon/fold/foldgutter.css')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/comment-fold.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/xml-fold.js')



export default {
	name: 'CodemirrorJavaScript',
	data () {
		return {
			code: '',
			editorOptions: {
				tabSize: 4,
				styleActiveLine: true,
				lineNumbers: true,
				line: true,
				foldGutter: true,
				styleSelectedText: true,
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
				highlightSelectionMatches: {
					showToken: /\w/,
					annotateScrollbar: true
				},
				mode: 'text/javascript',
				// hint.js options
				hintOptions: {
					// 当匹配只有一项的时候是否自动补全
					completeSingle: false
				},
				//快捷键 可提供三种模式 sublime、emacs、vim
				keyMap: "sublime",
				matchBrackets: true,
				showCursorWhenSelecting: true,
				theme: "monokai",
				extraKeys: {
					"Ctrl": "autocomplete"
				}
			},
		}
	},
	props: {
		value: { type: String, required: true },
	},
	watch: {
		value (newValue, oldValue) {
			this.code = newValue;
		},
		code (newValue, oldValue) {
			this.$emit('input', newValue);
		}
	},
	methods: {
	},
	components: { codemirror },
	created () {
		this.code = this.value;
	}
}
</script>

<style type="text/css">
	.CodeMirror {
		line-height: 18px !important;
		height: 500px !important;
		font-family: consolas !important;
	}

	.CodeMirror-scrollbar-filler {
		width: 10px;
		height: 10px;
	}

	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/  
	.CodeMirror ::-webkit-scrollbar {
		width: 10px;
		height: 10px;
		background-color: #F5F5F5;
	}

	/*定义滚动条轨道 内阴影+圆角*/
	.CodeMirror ::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
		/*border-radius: 5px;*/
		background-color: #F5F5F5;
	}

	/*定义滑块 内阴影+圆角*/  
	.CodeMirror ::-webkit-scrollbar-thumb {
		/*border-radius: 5px;*/
		-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,.3);
		background-color: #999;
	}


</style>
