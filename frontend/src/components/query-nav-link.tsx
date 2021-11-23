import { useLocation, NavLink } from "react-router-dom";

const QueryNavLink: React.FC<({to: string})> = ({to, ...props}) => {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props}/>;
}

export default QueryNavLink;
