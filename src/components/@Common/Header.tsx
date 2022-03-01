import React from 'react';
import { useNavigate } from 'react-router-dom'
import './Header.css';

type Props = {
  // The page title
  title: string;
};

/** Header component with navigation menu */
function Header({ title }: Props): React.ReactElement {
	const navigate = useNavigate();

  return (
		<div className="header">
			<h1 className="header-title">{title}</h1>
			<div className="header-menu">
				<ul>
					<li onClick={() => navigate(`/add-exam-results`)}>
						Add New Result
					</li>
					<li onClick={() => navigate(`/exam-results`)}>
						Exam Results
					</li>
				</ul>
			</div>
		</div>
  );
}

export default Header;