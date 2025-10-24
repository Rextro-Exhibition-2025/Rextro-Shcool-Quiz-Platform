// lib/violationService.ts
interface ViolationData {
    teamId: string;
    memberName: string;
    violationType: 'copy & paste' | 'escaping full screen';
    createdAt?: string;
    updatedAt?: string;
}

interface ViolationResponse {
    success: boolean;
    count: number;
    data: FetchedViolationData[];
}

interface FetchedViolationData {
    _id?: string;
    teamId: string;
    memberName: string;
    violationType: 'copy & paste' | 'escaping full screen';
    schoolName?: string;
    teamName?: string;
    educationalZone?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export const reportViolation = async (violationData: ViolationData): Promise<void> => {
    try {
        const authToken = localStorage.getItem('authToken');

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/violations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
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
    }
};

export const fetchAllViolations = async (): Promise<FetchedViolationData[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/violations/get-all`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch violations: ${response.status}`);
        }

        const result: ViolationResponse = await response.json();

        // ✅ Return only the data array, not the entire response
        return result.data || [];
    } catch (error) {
        console.error('Error fetching violations:', error);
        return [];
    }
}