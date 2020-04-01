
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

enum TMP36Type {
    //% block="(℃)" enumval=0
    TMP36_temperature_C,

    //% block="(℉)" enumval=1
    TMP36_temperature_F,
}

/**
 * Custom blocks
 */
//% weight=10 color=#0fbc11 icon="\uf015"
namespace sensorSuit {

    let Reference_VOLTAGE = 3100
    let crashSensorPin: DigitalPin

    /**
    * TODO: Crash Sensor Setup
    */
    //% blockId=octopus_crashsetup  blockGap=10
    //% block="Setup crash sensor at pin %crashpin"
    export function crashSensorSetup(crashpin: DigitalPin): void {
        crashSensorPin = crashpin;
        pins.setPull(crashpin, PinPullMode.PullUp)
    }



    /**
    * TODO: Checks whether the crash sensor is currently pressed.
    */
    //% blockId=octopus_crash  blockGap=30
    //% block="crash sensor pressed"
    export function crashSensor(): boolean {
        let a: number = pins.digitalReadPin(crashSensorPin);
        if (a == 0) {
            return true;
        } else return false;
    }



    /**
    * TODO: get soil moisture(0~100%)
    * @param soilmoisturepin describe parameter here, eg: AnalogPin.P1
    */
    //% blockId="readsoilmoisture" block="value of soil moisture(0~100) at pin %soilhumiditypin"
    export function ReadSoilHumidity(soilmoisturepin: AnalogPin): number {
        let voltage = 0;
        let soilmoisture = 0;
        voltage = pins.map(
            pins.analogReadPin(soilmoisturepin),
            0,
            1023,
            0,
            100
        );
        soilmoisture = voltage;
        return Math.round(soilmoisture);
    }


    /**
    * TODO: get light intensity(0~100%)
    * @param lightintensitypin describe parameter here, eg: AnalogPin.P1
    */
    //% blockId="readlightintensity" block="value of light intensity(0~100) at pin %lightintensitypin"
    export function ReadLightIntensity(lightintensitypin: AnalogPin): number {
        let voltage = 0;
        let lightintensity = 0;
        voltage = pins.map(
            pins.analogReadPin(lightintensitypin),
            0,
            1023,
            0,
            100
        );
        lightintensity = voltage;
        return Math.round(lightintensity);
    }




    /**
    * TODO: get TMP36 Temperature(℃ or ℉)
    * @param temppin describe parameter here, eg: AnalogPin.P1
    */
    //% blockId="readtemp" block="value of temperature %tmp36type|at pin %temppin"
    export function ReadTemperature(tmp36type: TMP36Type, temppin: AnalogPin): number {
        let voltage = 0;
        let Temperature = 0;
        pins.digitalWritePin(DigitalPin.P0, 0)
        voltage = pins.map(
            pins.analogReadPin(temppin),
            0,
            1023,
            0,
            Reference_VOLTAGE
        );
        Temperature = (voltage - 500) / 10;

        switch (tmp36type) {
            case 0:
                return Math.round(Temperature)
                break;
            case 1:
                return Math.round(Temperature * 9 / 5 + 32)
                break;
            default:
                return 0
        }
    }



    /** 
    * TODO: get noise(dB)
    * @param noisepin describe parameter here, eg: AnalogPin.P1
    */
    //% blockId="readnoise" block="value of noise(dB) at pin %noisepin"
    export function ReadNoise(noisepin: AnalogPin): number {
        let level = 0
        let voltage = 0
        let noise = 0
        let h = 0
        let l = 0
        let sumh = 0
        let suml = 0
        pins.digitalWritePin(DigitalPin.P0, 0)
        for (let i = 0; i < 1000; i++) {
            level = level + pins.analogReadPin(noisepin)
        }
        level = level / 1000
        for (let i = 0; i < 1000; i++) {
            voltage = pins.analogReadPin(noisepin)
            if (voltage >= level) {
                h += 1
                sumh = sumh + voltage
            } else {
                l += 1
                suml = suml + voltage
            }
        }
        if (h == 0) {
            sumh = level
        } else {
            sumh = sumh / h
        }
        if (l == 0) {
            suml = level
        } else {
            suml = suml / l
        }
        noise = sumh - suml
        if (noise <= 4) {
            noise = pins.map(
                noise,
                0,
                4,
                30,
                50
            )
        } else if (noise <= 8) {
            noise = pins.map(
                noise,
                4,
                8,
                50,
                55
            )
        } else if (noise <= 14) {
            noise = pins.map(
                noise,
                9,
                14,
                55,
                60
            )
        } else if (noise <= 32) {
            noise = pins.map(
                noise,
                15,
                32,
                60,
                70
            )
        } else if (noise <= 60) {
            noise = pins.map(
                noise,
                33,
                60,
                70,
                75
            )
        } else if (noise <= 100) {
            noise = pins.map(
                noise,
                61,
                100,
                75,
                80
            )
        } else if (noise <= 150) {
            noise = pins.map(
                noise,
                101,
                150,
                80,
                85
            )
        } else if (noise <= 231) {
            noise = pins.map(
                noise,
                151,
                231,
                85,
                90
            )
        } else {
            noise = pins.map(
                noise,
                231,
                1023,
                90,
                120
            )
        }
        noise = Math.round(noise)
        return Math.round(noise)
    }




}

