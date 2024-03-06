import React from "react"

export default function Tools(props) {

    return (
        <div className="tools">
            <div className="darkmode">
                <span>Darkmode</span>
                <div className="darkmode__switcher" onClick={props.toggleTheme}>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
