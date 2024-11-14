export const LANGUAGES = [
  {
    name: "javascript",
    version: "18.15.0",
    mode: "text/javascript",
    snippets: `function greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`
  },
  {
    name: "python",
    version: "3.10.0",
    mode: "text/x-python",
    snippets: `def greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`
  },
  {
    name: "java",
    version: "15.0.2",
    mode: "text/x-java",
    snippets: `public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`
  },
  {
    name: "c++",
    version: "10.2.0",
    mode: "text/x-c++src",
    snippets: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World in C++" << std::endl;\n    return 0;\n}\n'
  },
  {
    name: "c",
    version: "10.2.0",
    mode: "text/x-csrc",
    snippets: '#include <stdio.h>\n\nint main() {\n    printf("Hello World in C");\n    return 0;\n}\n'
  },
];

// export const CODE_SNIPPETS = {
//   javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
//   typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
//   python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
//   java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
//   "c++":
//     '#include <iostream>\n\nint main() {\n    std::cout << "Hello World in C++" << std::endl;\n    return 0;\n}\n',
//   c: '#include <stdio.h>\n\nint main() {\n    printf("Hello World in C");\n    return 0;\n}\n',
// };
