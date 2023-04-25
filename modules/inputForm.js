import styles from "@/styles/inputForm.module.css";


export default function InputForm(props) {

return(
    <>
        <form onSubmit={props.funkOnSubmit}>
            <div className={styles.group}>
                <input type="text" required value={props.newUrl} onChange={props.funkOnChange}/>
                <span className="highlight"></span>
                <span className="bar"></span>
                <label>Enter your url</label>
            </div>
            <button type="submit">
                Create Short Url
            </button>
        </form>
    </>
);

}