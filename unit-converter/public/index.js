const converterForm = document.querySelector("form")
const lengthForm = `<form >
        <div>
          <h3 class="unit">Enter the length to convert</h3>
          <input name="valueToConvert" type="number" />
        </div>
        <div>
          <h3>Unit to convert from</h3>
          <select name="fromUnit">
            <option value="ml">millimeter</option>
            <option value="cm">centimeter</option>
            <option value="m">meter</option>
            <option value="km">kilometer</option>
            <option value="inch">inch</option>
            <option value="foot">foot</option>
            <option value="yard">yard</option>
            <option value="mile">mile</option>
          </select>
        </div>
        <div>
          <h3>Unit to convert to</h3>
          <select name="toUnit">
            <option value="ml">millimeter</option>
            <option value="cm">centimeter</option>
            <option value="m">meter</option>
            <option value="km">kilometer</option>
            <option value="inch">inch</option>
            <option value="foot">foot</option>
            <option value="yard">yard</option>
            <option value="mile">mile</option>
          </select>
        </div>

        <button type="submit">Convert</button>
      </form>`
const weightForm = `<form >
        <div>
          <h3 class="unit">Enter the weight to convert</h3>
          <input name="valueToConvert" type="number" />
        </div>
        <div>
          <h3>Unit to convert from</h3>
          <select name="fromUnit">
            <option value="mg">milligram</option>
            <option value="g">gram</option>
            <option value="kg">kilogram</option>
            <option value="oz">ounce</option>
            <option value="lb">pound</option>
          </select>
        </div>
        <div>
          <h3>Unit to convert to</h3>
          <select name="toUnit">
            <option value="mg">milligram</option>
            <option value="g">gram</option>
            <option value="kg">kilogram</option>
            <option value="oz">ounce</option>
            <option value="lb">pound</option>
          </select>
        </div>

        <button>Convert</button>
      </form>`
const temperatureForm = `<form >
        <div>
          <h3 class="unit">Enter the temperature to convert</h3>
          <input name="valueToConvert" type="number" />
        </div>
        <div>
          <h3>Unit to convert from</h3>
          <select name="fromUnit">
            <option value="C">Celsius</option>
            <option value="F">Fahrenheit</option>
            <option value="K">Kelvin</option>
          </select>
        </div>
        <div>
          <h3>Unit to convert to</h3>
          <select name="toUnit">
            <option value="C">Celsius</option>
            <option value="F">Fahrenheit</option>
            <option value="K">Kelvin</option>
          </select>
        </div>

        <button type="submit">Convert</button>
      </form>`
const forms = {
    length: lengthForm,
    weight: weightForm,
    temperature: temperatureForm,
}
converterForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const typeUnit = document.querySelector(".unit").innerText.split(" ")[2]
    const data = {
        typeUnit: typeUnit,
        value: formData.get("valueToConvert"),
        fromUnit: formData.get("fromUnit"),
        toUnit: formData.get("toUnit")
    }

    try {
        const response = await fetch("/api/convert", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        document.querySelector("main").innerHTML = `
        <h3>Result of your calculation</h3>
        <div>
        <h2>${result.value} = ${result.convertedValue}</h2>
        <button class="reset">Reset</button>
        </div>
        `
        const reset = document.querySelector(".reset")
        reset.addEventListener("click", () => {
            document.querySelector("main").innerHTML = forms[typeUnit]
        })
    } catch (error) {
        console.error('Error:', error);
    }
})
