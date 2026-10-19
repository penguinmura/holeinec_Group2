/**
 * Inquiry Service
 * お問い合わせの保存ロジックを担当する
 */
const prisma = require('../db');
const logger = require('../utils/logger');

/**
 * 新しいお問い合わせデータをデータベースに保存する
 * @param {string} email - 返信用メールアドレス
 * @param {string} message - お問い合わせ内容
 */
const createInquiry = async (email, message) => {
    const inquiry = await prisma.inquiry.create({
        data: { email, message }
    });
    logger.info(`Inquiry received from ${email}. Message: "${message.substring(0, 60)}..."`, {
        category: 'inquiry',
        action: 'inquiry_received',
        email,
        inquiryMessage: message,
        inquiryId: inquiry.id
    });
    return inquiry;
};

module.exports = {
    createInquiry
};
