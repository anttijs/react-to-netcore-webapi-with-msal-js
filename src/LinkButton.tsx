import React from 'react'
import styles from './LinkButton.module.css'; 
interface LinkButtonProps {
    text: string;
    onClick: () => void;
    children: React.ReactNode
}
export type Ref = HTMLButtonElement
const LinkButton = React.forwardRef<Ref, LinkButtonProps>((props,ref) =>  (

<button ref={ref} className={styles.linkbutton} onClick={props.onClick}>
    {props.text}
    {props.children}
</button>

))
export default LinkButton