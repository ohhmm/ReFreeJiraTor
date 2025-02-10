import * as da from 'dynamic-agent';

// Initialize analyzer
const analyzer = new da.TechStackAnalyzer();

export async function sendToOpenHands(command: string)
{
    try 
    {
        // Analyze tech stack
        const result = await analyzer.process_text(command);

        // Access results
        if (result.success) {
            const { identified_technologies, stack_analysis } = result.data;
            console.log('Technologies:', identified_technologies);
            console.log('Stack Analysis:', stack_analysis);
        }

        return result as string;
    } catch (error) {
        console.error("Error sending query to OpenHands:", error);
        throw error;
    }
}
