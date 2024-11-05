import {useEffect, useState} from "react";

const checkWinner = (buttonMatrix, inRow) => {

    let counter;
    for (const row of buttonMatrix) {
        counter = 1;
        for (let i = 1; i < row.length; i++) {
            if (row[i].value === row[i - 1].value) {
                counter++;
                if (counter === inRow) return true;
            } else {
                counter = 1;
            }
        }
    }
    return false;
}

const stupidRobot = (buttonMatrix) => {
    let robotSymbol = "0";
    let userSymbol = "X"
    const columns = buttonMatrix[0].map((_, index) => buttonMatrix.map((item) => item[index]));

    for (const symbol of [robotSymbol, userSymbol]) {

        for (const row of buttonMatrix) {
            if (row.filter((item) => item.value === symbol).length === 2 &&
                row.filter((item) => item.disabled).length !== row.length) {
                const index = row.findIndex(item => item.disabled === false);
                row[index] = {...row[index], value: robotSymbol, disabled: true};
                return buttonMatrix;
            }
        }

        for (const column of columns) {
            if (column.filter((item) => item.value === symbol).length === 2 &&
                column.filter((item) => item.disabled).length !== column.length) {
                const button = column.find(item => item.disabled === false);
                buttonMatrix[button.row_index][button.column_index] = {
                    ...button, value: robotSymbol, disabled: true
                }
                return buttonMatrix;
            }
        }
    }

    while (true) {
        let randomRow = Math.floor(Math.random() * 3);
        let randomColumn = Math.floor(Math.random() * 3);
        if (!buttonMatrix[randomRow][randomColumn].disabled) {
            return buttonMatrix.map((rows) => rows.map((button) =>
                (button.row_index === randomRow && button.column_index === randomColumn) ?
                    {...button, value: robotSymbol, disabled: true} : button
            ))
        }
    }
}

export const GamePad = ({ rows, columns }) => {

    const [buttonMatrix, set_buttonMatrix] = useState(Array(rows).fill(null).map((_, row_index) => {
        return Array(columns).fill(null).map((_, column_index) => {
            return {
                row_index,
                column_index,
                value: `button_[${row_index}][${column_index}]`,
                disabled: false
            };
        });
    }))

    const handle_click = (row_index, column_index) => {

        let tempMatrix = buttonMatrix;

        tempMatrix = tempMatrix.map((rows) =>
            rows.map((button) =>
                (button.row_index === row_index && button.column_index === column_index) ?
                    {...button, value: "X", disabled: true} : button
        ))

        set_buttonMatrix(tempMatrix);

        if (checkWinner(tempMatrix, 3)) {
            setTimeout(() => {
                alert("Winner");
            }, 5)
        } else if (tempMatrix.every((rows) => rows.every((item) => item.disabled))) {
            setTimeout(() => {
                alert("Draw");
            })
        } else {
            tempMatrix = stupidRobot(tempMatrix);
            if (checkWinner(tempMatrix, 3)) {
                setTimeout(() => {
                    alert("Robot Wins !");
                }, 5)
            }
        }
        set_buttonMatrix(tempMatrix)
    }

    return (
        <section className="game_pad">
            {buttonMatrix.map((items) => items.map((item) => {
                return (
                    <button
                        key={`button_[${item.row_index}][${item.column_index}]`}
                        className="game_button"
                        value={item.value}
                        disabled={item.disabled}
                        onClick={() => handle_click(item.row_index, item.column_index)}
                    >
                        {item.value.length > 1 ? "" : item.value}
                    </button>
                );
            }))}
        </section>
    );
}