// lib/violationService.ts
interface ViolationData {
    teamId: string;
    memberName: string;
    violationType: 'copy & paste' | 'escaping full screen';
}

export const reportViolation = async (violationData: ViolationData): Promise<void> => {
    try {
        const authToken = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:3000/api/violations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Include auth token if needed
            },
            body: JSON.stringify(violationData)
        });

        if (!response.ok) {
            throw new Error(`Failed to report violation: ${response.status}`);
        }

        const result = await response.json();
        console.log('Violation reported successfully:', result);
    } catch (error) {
        console.error('Error reporting violation:', error);
        // Don't show error to user to avoid disrupting quiz experience
    }
};