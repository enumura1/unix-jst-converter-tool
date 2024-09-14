import * as assert from 'assert';
import { convertJstToUnix, convertUnixToJst } from '../utils/dateTimeHelpers';

type testProps = {
    name: string;
    testFunc: () => void;
};

// Simple test runner
function runTests() {
    let passedTests = 0;
    let failedTests = 0;

    // name：desc, testFunc：テスト対象の関数
    function test({name, testFunc}: testProps) {
        try {
            // テスト実行
            testFunc();
            console.log(`✓ ${name}`);
            passedTests++;
        } catch (error) {
            // テスト失敗
            console.error(`✗ ${name}`);
            console.error(error);
            failedTests++;
        }
    }

    // Test cases1：JST から UNIX タイムスタンプへの変換
    test({
        name: 'convertJstToUnix converts correctly',
        testFunc: () => {
            // 第１引数と第２引数の値が同じかをチェック
            assert.strictEqual(convertJstToUnix('2023-01-01 00:00:00'), 1672498800);
            assert.strictEqual(convertJstToUnix('2023-12-31 23:59:59'), 1704034799);
        }
    });

    // Test cases2：UNIX タイムスタンプ から JSTへの変換
    test({
        name: 'convertUnixToJst converts correctly',
        testFunc: () => {
            // 第１引数と第２引数の値が同じかをチェック
            assert.strictEqual(convertUnixToJst(1672498800), '2023-01-01 00:00:00');
            assert.strictEqual(convertUnixToJst(1704034799), '2023-12-31 23:59:59');
        }
    });

    // Test cases3：JST ⇒ UNIX ⇒ JST、可逆性確認 
    test({
        name: 'Conversion is reversible',
        testFunc: () => {
            const originalJst = '2023-06-15 12:34:56';
            const unix = convertJstToUnix(originalJst);
            const convertedJst = convertUnixToJst(unix);
            assert.strictEqual(originalJst, convertedJst);
        }
    });

    // テスト結果の集計と表示
    console.log(`\nTests completed: ${passedTests} passed, ${failedTests} failed.`);
}

// Run the tests
runTests();