<form className=" px-[16px]" onSubmit={handleGoForm}>
                <div>
                    {request.isRejected && <div className="bg-custompink py-[16px] w-full mb-8 rounded-xl px-2">{request.isRejected && <div className="text-center font-bold">Анкета отклонена модератором, отредактируйте её. Подробнее прочтите в чате или напишите в поддержку</div>}</div>}
                    {!request.approved && !request.isRejected && <div className="bg-custompink py-[16px] w-full mb-8 rounded-xl px-2 ">{!request.approved && <div className="text-center font-bold">Ваша анкета на модерации. Дождитесь подтверждения, чтобы оставлять отклики.<br />

                        Если у вас возникли вопросы, обратитесь в поддержку через бот или по кнопке внизу экрана</div>}</div>}
                    <div className="text-[20px] font-bold">Контактная информация</div>
                </div>
                <div className="mt-[27px] flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Имя Фамилия</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="flex gap-2 text-[12px] items-center opacity-70"><img src={attention} alt="attention" />Так ваше имя увидит заказчик </div>
                        <div><input required value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} type="text" placeholder="Иван Иванов" className=" px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Ваш ник Telegram</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="flex gap-2 text-[12px] items-center  opacity-70"><img src={attention} alt="attention" />Проверьте, что у вас открыты личные сообщения в Telegram</div>
                        <div><input required type="text" placeholder="@yournick" value={'@' + formData.userName} onChange={(event) => setFormData({ ...formData, userName: event.target.value })} className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Ваш номер телефона</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div><input value={formData.phoneNumber} required onChange={(event) => setFormData({ ...formData, phoneNumber: event.target.value })} type="text" placeholder="+7 999 000 00 00" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                </div>
                <div className="mt-[48px]">
                    <div className="text-[20px] font-bold">Ваша анкета</div>
                </div>
                <div className="mt-[27px] flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Категория</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="select-wrapper">
                            <select required value={formData.category} onChange={handleChange} className="custom-select" name="category" id="1">
                                {categories.map((el) => (
                                    <option key={el._id} value={el._id}>{el.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Город</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="select-wrapper">
                            <select required value={formData.setCitySearch} onChange={(event) => setFormData({ ...formData, setCitySearch: event.target.value })} className="custom-select" name="1" id="1">
                                {cities.map((el) => (
                                    <option key={el} value={el}>{el}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Укажите диапазон цен</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="flex items-center gap-[8px]">
                            <input required value={formData.priceFrom} onChange={(event) => setFormData({ ...formData, priceFrom: event.target.value })} type="text" placeholder="От 1 000 ₽" className=" px-[24px] py-[16px] border-black border-solid border-2 w-full" />
                            <input required value={formData.priceTo} onChange={(event) => setFormData({ ...formData, priceTo: event.target.value })} type="text" placeholder="До 10 000 ₽" className=" px-[24px] py-[16px] border-black border-solid border-2 w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Обо мне. Услуги и стоимость</div></div>
                        <div className="flex gap-2 text-[12px] items-center opacity-70"><img src={attention} alt="attention" />Здесь можете расписать ваш прайс-лист</div>
                        <div className="flex items-center gap-[8px]">
                            <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} className="h-[132px] px-[24px] py-[16px] border-black border-solid border-2 w-full" name="2" id="2" placeholder="Ваши сильные стороны, опыт и стоимость работ. Яркое описание увеличивает шансы  на получение заявки!"></textarea>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Instagram</div></div>
                        <div><input value={formData.instagram} onChange={(event) => setFormData({ ...formData, instagram: event.target.value })} type="text" placeholder="@yournick" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Vkontakte</div></div>
                        <div><input value={formData.vk} onChange={(event) => setFormData({ ...formData, vk: event.target.value })} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>YouTube</div></div>
                        <div><input value={formData.youtube} onChange={(event) => setFormData({ ...formData, youtube: event.target.value })} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>TikTok</div></div>
                        <div><input value={formData.tiktok} onChange={(event) => setFormData({ ...formData, tiktok: event.target.value })} type="text" placeholder="@yournick" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Добавьте аватарку и фото фона</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <div className="flex gap-2 text-[12px] items-center opacity-70">
                            <img src={attention} alt="attention" />Первое окно – аватарка, второе – фото фона вашего профиля
                        </div>
                        <div className="flex w-full gap-[16px]">
                            <input
                                type="file"
                                name="mainPhoto"
                                id="mainPhoto"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e)}
                            />
                            <label htmlFor="mainPhoto" className="border-black border-solid border-2 w-full h-[60px] flex items-center justify-center text-[40px]">
                                {formData.mainPhoto ? (
                                    <img src={process.env.REACT_APP_API_URL + formData.mainPhoto} alt="mainPhoto" className="w-full h-full object-cover" />
                                ) : (
                                    '+'
                                )}
                            </label>
                            <input
                                type="file"
                                name="backGroundPhoto"
                                id="backGroundPhoto"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e)}
                            />
                            <label htmlFor="backGroundPhoto" className="border-black border-solid border-2 w-full h-[60px] flex items-center justify-center text-[40px]">
                                {formData.backGroundPhoto ? (
                                    <img src={process.env.REACT_APP_API_URL + formData.backGroundPhoto} alt="backGroundPhoto" className="w-full h-full object-cover" />
                                ) : (
                                    '+'
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Добавьте фото в галерею</div>
                        </div>
                        <div className="flex w-full gap-[16px]">
                            <input accept="image/*" type="file" name="gallery1" id="gallery1" className="hidden" onChange={(e) => handleFileChange(e)} />
                            <label htmlFor="gallery1" className="border-black border-solid border-2 w-full h-[60px] flex items-center justify-center text-[40px]">
                                {formData.gallery?.[0] ? (
                                    <img src={process.env.REACT_APP_API_URL + formData.gallery[0]} alt="gallery1" className="w-full h-full object-cover" />
                                ) : (
                                    '+'
                                )}
                            </label>
                            <input accept="image/*" type="file" name="gallery2" id="gallery2" className="hidden" onChange={(e) => handleFileChange(e)} />
                            <label htmlFor="gallery2" className="border-black border-solid border-2 w-full h-[60px] flex items-center justify-center text-[40px]">
                                {formData.gallery?.[1] ? (
                                    <img src={process.env.REACT_APP_API_URL + formData.gallery[1]} alt="gallery2" className="w-full h-full object-cover" />
                                ) : (
                                    '+'
                                )}
                            </label>
                            <input accept="image/*" type="file" name="gallery3" id="gallery3" className="hidden" onChange={(e) => handleFileChange(e)} />
                            <label htmlFor="gallery3" className="border-black border-solid border-2 w-full h-[60px] flex items-center justify-center text-[40px]">
                                {formData.gallery?.[2] ? (
                                    <img src={process.env.REACT_APP_API_URL + formData.gallery[2]} alt="gallery2" className="w-full h-full object-cover" />
                                ) : (
                                    '+'
                                )}
                            </label>
                            <input accept="image/*" type="file" name="gallery4" id="gallery4" className="hidden" onChange={(e) => handleFileChange(e)} />
                            <label htmlFor="gallery4" className="border-black border-solid border-2 w-full h-[60px] flex items-center justify-center text-[40px]">
                                {formData.gallery?.[3] ? (
                                    <img src={process.env.REACT_APP_API_URL + formData.gallery[3]} alt="gallery2" className="w-full h-full object-cover" />
                                ) : (
                                    '+'
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Добавьте видео</div></div>
                        <div className="flex gap-2 text-[12px] items-center opacity-70"><img src={attention} alt="attention" />Ссылка на Vk-видео</div>
                        <div><input name="link_1" value={formData.videoLinks[0]} onChange={(event) => handleUpdateVideoLink(event)} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                        {formData.videoLinks[0] !== '' && <div><input name="link_2" value={formData.videoLinks[1]} onChange={(event) => handleUpdateVideoLink(event)} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>}
                        {formData.videoLinks[0] !== '' && formData.videoLinks[1] !== '' && <div><input name="link_3" value={formData.videoLinks[2]} onChange={(event) => handleUpdateVideoLink(event)} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>}
                    </div>


                    {request.approved === true || request.isRejected ? <div className="flex gap-3">
                        <input type="checkbox" required value={personAccept} onChange={(e) => setPersonAccept(e.target.checked)} id="accept_pers_data" /> <label htmlFor="accept_pers_data" className="text-[12px]"><Link className='text-black underline' to="https://docs.google.com/document/d/1ZeJG7cl2raszu6VWoclo38WSxZKl_qRt/edit">Согласен</Link> на обработку моих персональных данных согласно <Link className='text-black underline' to={"https://docs.google.com/document/d/13SBC6s4-XB9GCrZEUbNjqsj-_SBw5nvE/edit"}>Политике</Link></label>
                    </div> : ""}

                    <div className={`mb-6 flex flex-col gap-4 ${disabled ? "opacity-50" : ""}`}>
                        {request.approved === true || request.isRejected === true ? <DarkButton disabled={disabled} text={"Обновить"} /> : ""}
                        {!request.approved && <DarkButton text={"Написать в поддержку"} onClick={() => handleContactClick("eventApp_bot")} />}
                    </div>
                </div>
            </form>