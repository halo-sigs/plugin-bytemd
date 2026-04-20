import type { BytemdEditorContext, BytemdPlugin } from "bytemd";
import * as mteKernel from "@susisu/mte-kernel";

type AlignmentValue = string;

interface TableEditorOptions {
  leftMarginChars?: Set<string>;
  formatType?: string;
  minDelimiterWidth?: number;
  defaultAlignment?: string;
  headerAlignment?: string;
  smartCursor?: boolean;
}

type ResolvedTableEditorOptions = Required<TableEditorOptions>;

interface TablePoint {
  row: number;
  column: number;
}

interface TableRange {
  start: TablePoint;
  end: TablePoint;
}

interface MteTextEditor {
  getCursorPosition(): TablePoint;
  setCursorPosition(pos: TablePoint): void;
  setSelectionRange(range: TableRange): void;
  getLastRow(): number;
  acceptsTableEdit(row: number): boolean;
  getLine(row: number): string;
  insertLine(row: number, line: string): void;
  deleteLine(row: number): void;
  replaceLines(startRow: number, endRow: number, lines: Array<string>): void;
  transact(func: () => void): void;
}

interface MteTableEditor {
  cursorIsInTable(options: ResolvedTableEditorOptions): boolean;
  format(options: ResolvedTableEditorOptions): void;
  formatAll(options: ResolvedTableEditorOptions): void;
  escape(options: ResolvedTableEditorOptions): void;
  moveFocus(
    rowOffset: number,
    columnOffset: number,
    options: ResolvedTableEditorOptions
  ): void;
  alignColumn(
    alignment: AlignmentValue,
    options: ResolvedTableEditorOptions
  ): void;
  nextCell(options: ResolvedTableEditorOptions): void;
  previousCell(options: ResolvedTableEditorOptions): void;
  nextRow(options: ResolvedTableEditorOptions): void;
  insertRow(options: ResolvedTableEditorOptions): void;
  deleteRow(options: ResolvedTableEditorOptions): void;
  moveRow(offset: number, options: ResolvedTableEditorOptions): void;
  insertColumn(options: ResolvedTableEditorOptions): void;
  deleteColumn(options: ResolvedTableEditorOptions): void;
  moveColumn(offset: number, options: ResolvedTableEditorOptions): void;
}

type CmEditor = BytemdEditorContext["editor"];
type CmNamespace = BytemdEditorContext["codemirror"];
type CmPosition = ReturnType<CmEditor["getCursor"]>;
type CmPass = CmNamespace["Pass"];
type CmKeyMap = Exclude<Parameters<CmEditor["addKeyMap"]>[0], string>;

const {
  Alignment,
  TableEditor,
  options: createTableOptions,
} = mteKernel as {
  Alignment: {
    readonly NONE: AlignmentValue;
    readonly LEFT: AlignmentValue;
    readonly RIGHT: AlignmentValue;
    readonly CENTER: AlignmentValue;
  };
  TableEditor: new (textEditor: MteTextEditor) => MteTableEditor;
  options: (options: TableEditorOptions) => ResolvedTableEditorOptions;
};

const TABLE_OPTIONS = createTableOptions({
  smartCursor: true,
});

type MarkdownTableCommandName =
  | "format"
  | "formatAll"
  | "escape"
  | "nextCell"
  | "previousCell"
  | "nextRow"
  | "moveLeft"
  | "moveRight"
  | "moveUp"
  | "moveDown"
  | "insertRow"
  | "deleteRow"
  | "moveRowUp"
  | "moveRowDown"
  | "insertColumn"
  | "deleteColumn"
  | "moveColumnLeft"
  | "moveColumnRight"
  | "alignNone"
  | "alignLeft"
  | "alignCenter"
  | "alignRight";

const COMMANDS: Record<
  MarkdownTableCommandName,
  {
    requiresCursorInTable: boolean;
    run: (tableEditor: MteTableEditor) => void;
  }
> = {
  format: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.format(TABLE_OPTIONS),
  },
  formatAll: {
    requiresCursorInTable: false,
    run: (tableEditor) => tableEditor.formatAll(TABLE_OPTIONS),
  },
  escape: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.escape(TABLE_OPTIONS),
  },
  nextCell: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.nextCell(TABLE_OPTIONS),
  },
  previousCell: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.previousCell(TABLE_OPTIONS),
  },
  nextRow: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.nextRow(TABLE_OPTIONS),
  },
  moveLeft: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.moveFocus(0, -1, TABLE_OPTIONS),
  },
  moveRight: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.moveFocus(0, 1, TABLE_OPTIONS),
  },
  moveUp: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.moveFocus(-1, 0, TABLE_OPTIONS),
  },
  moveDown: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.moveFocus(1, 0, TABLE_OPTIONS),
  },
  insertRow: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.insertRow(TABLE_OPTIONS),
  },
  deleteRow: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.deleteRow(TABLE_OPTIONS),
  },
  moveRowUp: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.moveRow(-1, TABLE_OPTIONS),
  },
  moveRowDown: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.moveRow(1, TABLE_OPTIONS),
  },
  insertColumn: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.insertColumn(TABLE_OPTIONS),
  },
  deleteColumn: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.deleteColumn(TABLE_OPTIONS),
  },
  moveColumnLeft: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.moveColumn(-1, TABLE_OPTIONS),
  },
  moveColumnRight: {
    requiresCursorInTable: true,
    run: (tableEditor) => tableEditor.moveColumn(1, TABLE_OPTIONS),
  },
  alignNone: {
    requiresCursorInTable: true,
    run: (tableEditor) =>
      tableEditor.alignColumn(Alignment.NONE, TABLE_OPTIONS),
  },
  alignLeft: {
    requiresCursorInTable: true,
    run: (tableEditor) =>
      tableEditor.alignColumn(Alignment.LEFT, TABLE_OPTIONS),
  },
  alignCenter: {
    requiresCursorInTable: true,
    run: (tableEditor) =>
      tableEditor.alignColumn(Alignment.CENTER, TABLE_OPTIONS),
  },
  alignRight: {
    requiresCursorInTable: true,
    run: (tableEditor) =>
      tableEditor.alignColumn(Alignment.RIGHT, TABLE_OPTIONS),
  },
};

interface WorkingSelection {
  anchor: CmPosition;
  head: CmPosition;
}

class CodeMirrorTableTextEditor implements MteTextEditor {
  private transactionDepth = 0;
  private workingLines: string[] | null = null;
  private workingSelection: WorkingSelection | null = null;

  constructor(
    private readonly editor: CmEditor,
    private readonly codemirror: CmNamespace
  ) {}

  getCursorPosition(): TablePoint {
    const selection = this.getSelection();
    return {
      row: selection.head.line,
      column: selection.head.ch,
    };
  }

  setCursorPosition(pos: TablePoint): void {
    if (this.transactionDepth === 0) {
      this.transact(() => this.setCursorPosition(pos));
      return;
    }

    const target = this.toCmPosition(pos);
    this.workingSelection = {
      anchor: target,
      head: target,
    };
  }

  setSelectionRange(range: TableRange): void {
    if (this.transactionDepth === 0) {
      this.transact(() => this.setSelectionRange(range));
      return;
    }

    this.workingSelection = {
      anchor: this.toCmPosition(range.start),
      head: this.toCmPosition(range.end),
    };
  }

  getLastRow(): number {
    return this.getLines().length - 1;
  }

  acceptsTableEdit(row: number): boolean {
    return row >= 0 && row <= this.getLastRow();
  }

  getLine(row: number): string {
    return this.getLines()[row] ?? "";
  }

  insertLine(row: number, line: string): void {
    if (this.transactionDepth === 0) {
      this.transact(() => this.insertLine(row, line));
      return;
    }

    const lines = this.getMutableLines();
    const targetRow = clamp(row, 0, lines.length);
    lines.splice(targetRow, 0, line);
  }

  deleteLine(row: number): void {
    if (this.transactionDepth === 0) {
      this.transact(() => this.deleteLine(row));
      return;
    }

    const lines = this.getMutableLines();
    if (row < 0 || row >= lines.length) {
      return;
    }
    lines.splice(row, 1);
    if (lines.length === 0) {
      lines.push("");
    }
  }

  replaceLines(startRow: number, endRow: number, lines: Array<string>): void {
    if (this.transactionDepth === 0) {
      this.transact(() => this.replaceLines(startRow, endRow, lines));
      return;
    }

    const mutableLines = this.getMutableLines();
    const start = clamp(startRow, 0, mutableLines.length);
    const end = clamp(endRow, start, mutableLines.length);
    mutableLines.splice(start, end - start, ...lines);
    if (mutableLines.length === 0) {
      mutableLines.push("");
    }
  }

  transact(func: () => void): void {
    const isRootTransaction = this.transactionDepth === 0;
    if (isRootTransaction) {
      this.workingLines = [...this.getLines()];
      this.workingSelection = this.getSelection();
    }

    this.transactionDepth += 1;

    try {
      func();
    } finally {
      this.transactionDepth -= 1;
      if (isRootTransaction) {
        this.commit();
      }
    }
  }

  private getSelection(): WorkingSelection {
    if (this.workingSelection) {
      return this.workingSelection;
    }

    const [selection] = this.editor.listSelections();
    if (selection) {
      return {
        anchor: selection.anchor,
        head: selection.head,
      };
    }

    const cursor = this.editor.getCursor();
    return {
      anchor: cursor,
      head: cursor,
    };
  }

  private getLines(): string[] {
    if (this.workingLines) {
      return this.workingLines;
    }
    return normalizeLines(this.editor.getValue().split("\n"));
  }

  private getMutableLines(): string[] {
    if (!this.workingLines) {
      this.workingLines = [...this.getLines()];
    }
    return this.workingLines;
  }

  private toCmPosition(point: TablePoint): CmPosition {
    const lines = this.getMutableLines();
    const row = clamp(point.row, 0, lines.length - 1);
    const column = clamp(point.column, 0, lines[row].length);
    return this.codemirror.Pos(row, column);
  }

  private commit(): void {
    const previousDoc = this.editor.getValue();
    const nextLines = normalizeLines(
      this.workingLines ?? previousDoc.split("\n")
    );
    const nextDoc = nextLines.join("\n");
    const selection = this.workingSelection ?? this.getSelection();

    this.editor.operation(() => {
      if (nextDoc !== previousDoc) {
        const firstLine = this.editor.firstLine();
        const lastLine = this.editor.lastLine();
        const lastLineText = this.editor.getLine(lastLine) ?? "";
        this.editor.replaceRange(
          nextDoc,
          this.codemirror.Pos(firstLine, 0),
          this.codemirror.Pos(lastLine, lastLineText.length),
          "+input"
        );
      }

      this.editor.setSelection(selection.anchor, selection.head, {
        origin: "+move",
        scroll: false,
      });
    });

    this.workingLines = null;
    this.workingSelection = null;
  }
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const normalizeLines = (lines: string[]): string[] => {
  return lines.length > 0 ? lines : [""];
};

const runMarkdownTableCommand = (
  ctx: BytemdEditorContext,
  commandName: MarkdownTableCommandName,
  requireCurrentTable = true
): void | CmPass => {
  const command = COMMANDS[commandName];
  const tableEditor = new TableEditor(
    new CodeMirrorTableTextEditor(ctx.editor, ctx.codemirror)
  );
  const mustBeInTable = requireCurrentTable && command.requiresCursorInTable;

  if (mustBeInTable && !tableEditor.cursorIsInTable(TABLE_OPTIONS)) {
    return ctx.codemirror.Pass;
  }

  command.run(tableEditor);
};

const addShortcut = (
  keyMap: CmKeyMap,
  shortcuts: string[],
  handler: (ctx: BytemdEditorContext) => void | CmPass,
  ctx: BytemdEditorContext
) => {
  shortcuts.forEach((shortcut) => {
    keyMap[shortcut] = () => handler(ctx);
  });
};

const createMarkdownTableKeyMap = (ctx: BytemdEditorContext): CmKeyMap => {
  const keyMap: CmKeyMap = {};

  addShortcut(
    keyMap,
    ["Tab"],
    (context) => runMarkdownTableCommand(context, "nextCell"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Shift-Tab"],
    (context) => runMarkdownTableCommand(context, "previousCell"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Enter"],
    (context) => runMarkdownTableCommand(context, "nextRow"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Esc"],
    (context) => runMarkdownTableCommand(context, "escape"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Alt-F", "Cmd-Alt-F"],
    (context) => runMarkdownTableCommand(context, "format"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Alt-Shift-F", "Cmd-Alt-Shift-F"],
    (context) => runMarkdownTableCommand(context, "formatAll", false),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Left", "Cmd-Left"],
    (context) => runMarkdownTableCommand(context, "moveLeft"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Right", "Cmd-Right"],
    (context) => runMarkdownTableCommand(context, "moveRight"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Up", "Cmd-Up"],
    (context) => runMarkdownTableCommand(context, "moveUp"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Down", "Cmd-Down"],
    (context) => runMarkdownTableCommand(context, "moveDown"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Shift-Ctrl-Left", "Shift-Cmd-Left"],
    (context) => runMarkdownTableCommand(context, "alignLeft"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Shift-Ctrl-Right", "Shift-Cmd-Right"],
    (context) => runMarkdownTableCommand(context, "alignRight"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Shift-Ctrl-Up", "Shift-Cmd-Up"],
    (context) => runMarkdownTableCommand(context, "alignCenter"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Shift-Ctrl-Down", "Shift-Cmd-Down"],
    (context) => runMarkdownTableCommand(context, "alignNone"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Alt-Up", "Cmd-Alt-Up"],
    (context) => runMarkdownTableCommand(context, "moveRowUp"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Alt-Down", "Cmd-Alt-Down"],
    (context) => runMarkdownTableCommand(context, "moveRowDown"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Alt-Left", "Cmd-Alt-Left"],
    (context) => runMarkdownTableCommand(context, "moveColumnLeft"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-Alt-Right", "Cmd-Alt-Right"],
    (context) => runMarkdownTableCommand(context, "moveColumnRight"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-K Ctrl-I", "Cmd-K Cmd-I"],
    (context) => runMarkdownTableCommand(context, "insertRow"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-K Alt-Ctrl-I", "Cmd-K Alt-Cmd-I"],
    (context) => runMarkdownTableCommand(context, "deleteRow"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-K Ctrl-J", "Cmd-K Cmd-J"],
    (context) => runMarkdownTableCommand(context, "insertColumn"),
    ctx
  );
  addShortcut(
    keyMap,
    ["Ctrl-K Alt-Ctrl-J", "Cmd-K Alt-Cmd-J"],
    (context) => runMarkdownTableCommand(context, "deleteColumn"),
    ctx
  );

  return ctx.codemirror.normalizeKeyMap(keyMap);
};

export function markdownTable(): BytemdPlugin {
  return {
    editorEffect(ctx: BytemdEditorContext) {
      const keyMap = createMarkdownTableKeyMap(ctx);
      ctx.editor.addKeyMap(keyMap);

      return () => {
        ctx.editor.removeKeyMap(keyMap);
      };
    },
  };
}
