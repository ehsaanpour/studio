import { readJsonFile, writeJsonFile } from './fs-utils';

const PROGRAM_NAMES_FILE = 'src/data/program-names.json';

export type ProgramName = string;

type Listener = () => void;
const listeners: Listener[] = [];

function notifyListeners() {
  listeners.forEach(listener => listener());
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

export async function getProgramNames(): Promise<ProgramName[]> {
  try {
    const data = await readJsonFile(PROGRAM_NAMES_FILE);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading program names:', error);
    return [];
  }
}

export async function addProgramName(programName: ProgramName): Promise<void> {
  try {
    const programNames = await getProgramNames();
    if (!programNames.includes(programName)) {
      programNames.push(programName);
      await writeJsonFile(PROGRAM_NAMES_FILE, programNames);
      notifyListeners(); // Notify listeners after successful write
    }
  } catch (error) {
    console.error('Error adding program name:', error);
  }
}

export async function removeProgramName(programName: ProgramName): Promise<void> {
  try {
    let programNames = await getProgramNames();
    const initialLength = programNames.length;
    programNames = programNames.filter(name => name !== programName);
    if (programNames.length < initialLength) {
      await writeJsonFile(PROGRAM_NAMES_FILE, programNames);
      notifyListeners(); // Notify listeners after successful write
    }
  } catch (error) {
    console.error('Error removing program name:', error);
  }
}
