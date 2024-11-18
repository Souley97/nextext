import { useState, useEffect } from 'react';

const usePointageParSemaine = () => {
    const [pointages, setPointages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPointages = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/pointages/semaines');
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message || 'Erreur lors de la récupération des pointages.');
                    if (response.status === 404) {
                        setPointages([]); // Si aucun pointage trouvé, définissez un tableau vide
                    }
                } else {
                    const data = await response.json();
                    if (data.success) {
                        setPointages(data.pointages);
                    } else {
                        setError(data.message);
                    }
                }
            } catch (err) {
                setError('Erreur lors de la récupération des pointages.');
            } finally {
                setLoading(false);
            }
        };

        fetchPointages();
    }, []);

    return { pointages, loading, error };
};

export default usePointageParSemaine;
