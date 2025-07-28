/**
 * Reads a tutorial markdown file
 * @param topic The topic of the tutorial (e.g., 'java', 'Spring Boot and Microservice')
 * @returns The content of the markdown file as a string
 */
export const readTutorial = async (topic: string): Promise<string> => {
  try {
    // Dynamically import the markdown file using the topic directly.
    // The topic should now match the filename without the .md extension.
    // Webpack returns the URL of the file; fetch its raw text.
    let module;
    try {
      module = await import(`../../data/tutorials/${topic}.md`);
    } catch {
      // fallback: replace spaces with underscores (e.g., 'Spring Boot' -> 'Spring_Boot')
      const sanitized = topic.replace(/\s+/g, '_');
      module = await import(`../../data/tutorials/${sanitized}.md`);
    }
    const url = module.default as string;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tutorial markdown: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error reading tutorial for topic ${topic}:`, error);
    throw new Error(`Could not read tutorial for topic: ${topic}`);
  }
};

/**
 * Gets a list of available tutorial topics
 * @returns Array of tutorial topic names
 */
export const getTutorialTopics = (): string[] => {
  // This function now returns the actual filenames without the .md extension.
  // This ensures the topics in the UI directly match the files.
  return [
    'java',
    'Spring Boot and Microservice',
    'System Design',
    'LLD',
    'mvc'
  ];
};
