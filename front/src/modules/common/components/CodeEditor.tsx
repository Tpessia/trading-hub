import AceEditor, { IAceEditorProps } from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-gob";
import "ace-builds/src-noconflict/theme-idle_fingers";
import "ace-builds/src-noconflict/theme-kr_theme";
import "ace-builds/src-noconflict/theme-merbivore";
import "ace-builds/src-noconflict/theme-merbivore_soft";
import "ace-builds/src-noconflict/theme-mono_industrial";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-vibrant_ink";

import React from 'react';
import variables from "../../../variables";



interface Props extends IAceEditorProps {

}

export default class CodeEditor extends React.Component<Props> {
    style: React.CSSProperties = {
        width: '100%',
        border: `8px solid ${variables.bodySecundary}`
    }

    render() {
        // const themes = [
        //     'ambiance',
        //     'chaos',
        //     'clouds_midnight',
        //     'dracula',
        //     'cobalt',
        //     'gruvbox',
        //     'gob',
        //     'idle_fingers',
        //     'kr_theme',
        //     'merbivore',
        //     'merbivore_soft',
        //     'mono_industrial',
        //     'monokai',
        //     'pastel_on_dark',
        //     'solarized_dark',
        //     'terminal',
        //     'tomorrow_night',
        //     'tomorrow_night_blue',
        //     'tomorrow_night_bright',
        //     'tomorrow_night_eighties',
        //     'twilight',
        //     'vibrant_ink'
        // ]

        const { style, editorProps, ...rest } = this.props

        return (
            <AceEditor
                style={{ ...style, ...this.style }}
                mode="javascript"
                theme="twilight"
                name="code_editor"
                editorProps={{ ...editorProps, $blockScrolling: true }}
                showPrintMargin={false}
                setOptions={{
                    // useWorker: false
                }}
                {...rest}
            />
        )
    }
}