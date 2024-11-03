import CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/display/fullscreen.css";
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { ACTIONS } from "../actions/Action";
import { runCode } from "../api/api";
import { LANGUAGES } from "../helper/constants";

const CodeEditor = ({ socketRef, roomId, onCodeChange, onLanguageChange }) => {
  const editorRef = useRef(null);
  const selectedLanguageRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outputSection, setOutputSection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [result, setResult] = useState({});
  const isItFirst = useRef(true);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRunCode = async () => {
    setLoading(true);
    setOutputSection(true);
    const code = editorRef.current.getValue();
    const codeDetails = {
      language: selectedLanguage.name,
      version: selectedLanguage.version,
      files: [
        {
          content: code,
        },
      ],
    };
    try {
      const response = await runCode(codeDetails);
      setResult(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const init = async () => {
      const codeArea = document.getElementById("codeArea");
      if (codeArea) {
        editorRef.current = CodeMirror.fromTextArea(
          document.getElementById("codeArea"),
          {
            // mode: { name: "text/javascript", json: true },
            mode: selectedLanguage?.mode,
            theme: "dracula",
            autoCloseTags: true,
            autoCloseBrackets: true,
            lineNumbers: true,
            // lineWrapping: true,
          }
        );
      }
      editorRef.current.setSize(null, "100%");

      // editorRef.current.setValue(selectedLanguage?.snippets);
      editorRef.current.on("change", (event, instance) => {
        if (instance.origin !== "setValue" && event.getValue() !== null) {
          onCodeChange(event.getValue());
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            value: event.getValue(),
            roomId,
          });
        }
      });
    };
    init();
  }, [roomId, socketRef]);

  useEffect(() => {
    if (socketRef.current === null) return;
    socketRef.current.on(ACTIONS.CODE_CHANGE, (value) => {
      editorRef.current.setValue(value);
    });
    socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, (language) => {
      editorRef.current.setOption("mode", language.mode);
      setSelectedLanguage(language || selectedLanguage);
    });
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div className="h-screen relative box-border rounded-md overflow-hidden bg-[#ffffff0f]">
      <div className="flex py-2 px-4 justify-between box-border h-[6vh] items-center">
        <div className="left ">
          <div>
            <Button
              onClick={handleClick}
              size="small"
              endIcon={<FaAngleDown color="text.secondary" />}
              color="secondary"
            >
              {selectedLanguage.name}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {LANGUAGES.map((language) => (
                <MenuItem
                  key={language.name}
                  onClick={() => {
                    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
                      language,
                      roomId,
                    });
                    editorRef.current.setOption("mode", language.mode);
                    setSelectedLanguage(language);
                    onLanguageChange(language);
                    handleClose();
                  }}
                  className="uppercase"
                >
                  {language.name}
                  &nbsp;{language.version}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
        <div className="right">
          <ul className="flex gap-2 items-center text-white">
            <li>
              <Tooltip title="Run Code" arrow>
                <div
                  className="shadow-xl bg-gray-700 flex justify-center items-center gap-2 rounded-lg py-1 px-3 hover:shadow-none cursor-pointer"
                  onClick={handleRunCode}
                >
                  <span className="text-white">Run</span>
                  <CiPlay1 className="text-white" />
                </div>
              </Tooltip>
            </li>
            {/* <li>
              <Tooltip title="Run Code" arrow>
                <div
                  className="shadow-xl bg-gray-700 flex justify-center items-center gap-2 rounded-lg py-1 px-3 hover:shadow-none cursor-pointer"
                  onClick={handleRetrieveData}
                >
                  <span className="text-white">Retrieve data</span>
                  <CiPlay1 className="text-white" />
                </div>
              </Tooltip>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="h-[94vh] w-full">
        <textarea id="codeArea" className="h-full"></textarea>
        <Drawer
          anchor={"bottom"}
          open={outputSection}
          onClose={() => setOutputSection(false)}
          PaperProps={{
            style: {
              // width: "calc(100vw - 300px)",
              height: "16rem",
              left: "300px",
              backgroundColor: "#1c1e29",
            },
          }}
        >
          <div className=" w-full h-12 bg-[#1c1e29] flex justify-between px-4 items-center">
            <Typography
              variant="body2"
              className="text-white"
              style={{
                fontFamily: `"Baloo 2", sans-serif`,
              }}
            >
              Output
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOutputSection((prev) => !prev)}
            >
              <FaAngleDown className="text-white" />
            </IconButton>
          </div>

          <Divider
            sx={{
              backgroundColor: "#ffffff1f",
            }}
          />
          <div className="px-4 py-2 text-white">
            {loading ? (
              <div className="text-white text-xl animate-pulse">Loading...</div>
            ) : result ? (
              result?.run?.code !== 1 ? (
                <div className="text-green-500">
                  {result?.run?.stdout?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="text-red-500">
                  {result?.run?.stderr?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              )
            ) : (
              "Output will be displayed here"
            )}
          </div>
        </Drawer>
      </div>
      <div className="absolute bottom-0 w-full h-12 bg-[#1c1e29] flex justify-between px-4 items-center underline">
        <Typography
          variant="body2"
          className="text-white"
          style={{
            fontFamily: `"Baloo 2", sans-serif`,
          }}
        >
          Output
        </Typography>
        <IconButton
          size="small"
          onClick={() => setOutputSection((prev) => !prev)}
        >
          <FaAngleDown className="text-white" />
        </IconButton>
      </div>
    </div>
  );
};

export default CodeEditor;
