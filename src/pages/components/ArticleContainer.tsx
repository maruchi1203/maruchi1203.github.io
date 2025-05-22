import theme from "@styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Article {
  id: number;
  name: string;
  html_url: string;
  description: string;
  private: boolean;
}

interface ArticleContainerProps {
  [key: string]: unknown;
}

const Wrapper = styled.div`
  padding: 20px;

  width: 100%;

  border-radius: 5px;

  background-color: ${theme.lightColors.primary};
`;

/**
 * 리포지토리
 */
function ArticleContainer(props: ArticleContainerProps) {
  const { username } = props;

  const [article, setArticle] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {};

    fetchRepos();
  }, [username]);

  if (loading) {
    return <Wrapper>💁‍♂️로딩 중......</Wrapper>;
  }
  if (error) {
    return <Wrapper>❓죄송합니다. 해당 리포지토리를 찾을 수 없습니다.</Wrapper>;
  }

  return <Wrapper></Wrapper>;
}

export default ArticleContainer;
