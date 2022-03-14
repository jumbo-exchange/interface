import { generatePath, useNavigate } from 'react-router-dom';
import { TO_SWAP_URL } from 'utils/routes';

const useNavigateSwapParams = () => {
  const navigate = useNavigate();

  return (inputToken: string, outputToken: string) => {
    const path = generatePath(TO_SWAP_URL, {
      inputToken,
      outputToken,
    });
    navigate(path);
  };
};

export default useNavigateSwapParams;
